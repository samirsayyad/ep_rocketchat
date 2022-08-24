export default (payLoad) => {
  $('#ep_rocketchat_onlineUsersList').empty();
  if (!payLoad.data.onlineUsers) return;
  if (!payLoad.data.onlineUsers.online) return;
  let elements = '';
  payLoad.data.onlineUsers.online.forEach(({username}) => {
    console.info('element', username);

    const {padId, serverTimestamp: time} = clientVars;
    const userProfileImageURL = `/static/getUserProfileImage/${username}/${padId}?t=${time}`;
    elements += `
            <div data-userId="${username}" class="avatar">
                <div
                  class="ep_rocketchat_onlineUsersList_avatarImg"
                  style="
                    background: url(${userProfileImageURL}) no-repeat 50% 50% ;
                    background-size: 28px;
                    background-color: #fff;
                  ">
                  </div>
            </div>`;
  });

  if (elements) { $('#ep_rocketchat_onlineUsersList').append(elements); }
};
