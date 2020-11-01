const sha256 = require('js-sha256');
const config = require('../../config/env.config');

module.exports = {
    name: 'users',

    mixins: [],

    dependencies: [],

    actions: {
        signup: {
            params: {
                name: 'string',
                birthDate: 'string',
                legalId: 'string',
                specialNeeds: 'boolean',
                gender: 'string',
                isPregnant: 'boolean',
                mail: 'string',
                password: 'string',
                $$strict: true
            },
            async handler(ctx) {
                const { name, birthDate, legalId, specialNeeds,
                    gender, isPregnant, mail, password } = ctx.params;

                try {
                    const res = await ctx.call('profiles.getByLegalId', {legalId});
                    if(!res) {
                        const entity = await ctx.call('entities.create', {
                            type: 'user',
                            status: 'active'
                        });

                        await ctx.call('credentials.create', {
                            entityUuid: entity.uuid,
                            type: 'e-mail',
                            user: mail,
                            password: password
                        });

                        await ctx.call('profiles.create', {
                            entityUuid: entity.uuid,
                            name: name,
                            legalId: legalId,
                            birthDate: new Date(birthDate),
                            gender: gender,
                            isPregnant: isPregnant,
                            specialNeeds: specialNeeds,
                        });

                        ctx.meta.$statuscode = 201;
                        return Promise.resolve('User created');
                    } else {
                        ctx.meta.$statuscode = 400;
                        return Promise.reject('User already registered');
                    }

                } catch (err) {
                    let message = 'Error while trying to create user';
                    if (ctx.meta.$statuscode) {
                        message = err;
                    }
                    return Promise.reject(message);
                }

            }
        },
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
                    if ((credentials && credentials.hash === pass) && user.type === 'user') {
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