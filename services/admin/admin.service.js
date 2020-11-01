const sha256 = require('js-sha256');
const config = require('../../config/env.config');

module.exports = {
    name: 'admin',

    mixins: [],

    dependencies: [],

    actions: {
        login: {
            params: {
                user: 'string',
                password: 'string'
            },
            async handler(ctx) {
                try {
                    const credentials = await ctx.call('credentials.getByUser', {user: ctx.params.user});
                    const user = await ctx.call('entities.getByUuid', {uuid: credentials.entityUuid});
                    let pass = sha256(ctx.params.password + config.salt);
                    if ((credentials && credentials.hash === pass) && user.type === 'admin') {
                        credentials.userType = user.type;
                        return ctx.call('jwt.generateToken', credentials).then((res) => {
                            return {
                                token: res,
                                status: user.status
                            };
                        });
                    } else {
                        ctx.meta.$statuscode = 401;
                        return Promise.reject('Invalid credentials');
                    }
                } catch (e) {
                    let message = 'Error while trying to verify user';
                    if (ctx.meta.$statuscode) {
                        message = e;
                    }
                    return Promise.reject(message);
                }
            }
        }
    },
};