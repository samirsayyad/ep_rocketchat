'use strict';

const config = require('../helpers/configs');
const loginApi = require('../../rocketChat/api/separated').login;
const db = require('ep_etherpad-lite/node/db/DB');
const rocketChatClientInstance = require('../../rocketChat/clients/rocketChatClientInstance').rocketChatClientInstance;

const getUserByEtherUserId = async (etherpadUserId) => await db.get(`ep_rocketchat_users_${config.dbRocketchatKey}:${etherpadUserId}`);

const getByRocketChatUserId = async (rocketChatUserId) => await db.get(`ep_rocketchat_users_${config.dbRocketchatKey}:${rocketChatUserId}`);


const login = async (etherpadUserId, username, password) => {
  try {
    if (!username || !password) {
      const globalProfileInfo = await db.get(`ep_profile_modal:${etherpadUserId}`) || {};
      let tempUsername;
      if (globalProfileInfo.username) tempUsername = globalProfileInfo.username.replace(/\s/g, '') || 'Anonymous';
      else tempUsername = 'Anonymous';

      password = `${tempUsername}-${etherpadUserId}@docs.plus${config.passwordSalt}`;
      // var username = `${tempUsername}_${etherpadUserId.replace(/\s/g, '.')}`;
      username = etherpadUserId;
    }

    const loginResult = await loginApi(config.protocol, config.host, config.port, username, password);
    if (loginResult) {
      // await saveCredential(etherpadUserId ,loginResult.data.userId , loginResult.data.authToken ,  null );
      return {userId: loginResult.data.userId, authToken: loginResult.data.authToken} || false;
    } else {
      return false;
    }
  } catch (e) {
    console.log('login method : ', e.message);
    return false;
  }
};

const saveCredential = async (etherpadUserId, rocketchatUserId, rocketchatAuthToken, info) => {
  if (info) {
    await db.set(`ep_rocketchat_users_${config.dbRocketchatKey}:${etherpadUserId}`, {rocketchatUserId, rocketchatAuthToken, ...info});
    await db.set(`ep_rocketchat_users_${config.dbRocketchatKey}:${rocketchatUserId}`, {etherpadUserId, rocketchatAuthToken, ...info});
  } else {
    await db.set(`ep_rocketchat_users_${config.dbRocketchatKey}:${etherpadUserId}`, {rocketchatUserId, rocketchatAuthToken});
    await db.set(`ep_rocketchat_users_${config.dbRocketchatKey}:${rocketchatUserId}`, {etherpadUserId, rocketchatAuthToken});
  }
};

const register = async (etherpadUserId, randomUsername) => {
  try {
    const globalProfileInfo = await db.get(`ep_profile_modal:${etherpadUserId}`) || {};
    let name;
    if (globalProfileInfo.username) name = globalProfileInfo.username.replace(/\s/g, '') || 'Anonymous';
    else name = 'Anonymous';

    const password = `${name}-${etherpadUserId}@docs.plus${config.passwordSalt}`;
    const usernameUserId = `${(!randomUsername) ? etherpadUserId : `${etherpadUserId}_${Math.floor(Math.random() * 10000)}`}`; // if random enabled means something bad happend for users
    const email = globalProfileInfo.email ? globalProfileInfo.email : `${usernameUserId}@docs.plus`;

    const userToAdd = {
      name,
      email,
      password,
      username: usernameUserId,
      sendWelcomeEmail: false,
      joinDefaultChannels: false,
      verified: true,
      requirePasswordChange: false,
      roles: ['user'],
    };

    const rocketChatClient = rocketChatClientInstance(config.protocol, config.host, config.port, config.userId, config.token, () => {});
    const newUser = await rocketChatClient.users.create(userToAdd);
    saveCredential(etherpadUserId, newUser.user._id, null, {username: userToAdd.username, password: userToAdd.password});
    return {userId: newUser.user._id, info: userToAdd};
  } catch (e) {
    console.log('register method : ', e.message);
    return false;
  }
};

const runValidator = async (etherpadUserId) => {
  try {
    const rocketChatUser = await db.get(`ep_rocketchat_users_${config.dbRocketchatKey}:${etherpadUserId}`) || [];
    let rocketchatUserId, rocketchatAuthToken;
    if (rocketChatUser.rocketchatAuthToken && rocketChatUser.rocketchatUserId) return {rocketchatUserId: rocketChatUser.rocketchatUserId, rocketchatAuthToken: rocketChatUser.rocketchatAuthToken};

    if (rocketChatUser.rocketchatUserId && rocketChatUser.username && !rocketChatUser.rocketchatAuthToken) { // it means login once and store credential
      rocketchatUserId = rocketChatUser.rocketchatUserId;
      // regenerate token
      const loginResult = await login(etherpadUserId, rocketChatUser.username, rocketChatUser.password);
      rocketchatAuthToken = loginResult.authToken;
    } else {
      const loginResult = await login(etherpadUserId);
      if (loginResult) {
        rocketchatUserId = loginResult.userId;
        rocketchatAuthToken = loginResult.authToken;
      } else {
        const registerResult = await register(etherpadUserId); // || await register(etherpadUserId,true);
        if (registerResult) {
          const loginResult = await login(etherpadUserId, registerResult.info.username, registerResult.info.password);
          rocketchatUserId = loginResult.userId;
          rocketchatAuthToken = loginResult.authToken;
        } else {
          console.error('registerResult', registerResult);
        }
      }
    }

    await saveCredential(etherpadUserId, rocketchatUserId, rocketchatAuthToken, null);
    return {rocketchatUserId, rocketchatAuthToken};
  } catch (e) {
    console.log(e.message, 'runValidator');
  }
};


module.exports = {
  runValidator,
  getUserByEtherUserId,
  getByRocketChatUserId,
};
