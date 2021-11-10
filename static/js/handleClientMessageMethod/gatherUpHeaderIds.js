exports.gatherUpHeaderIds = function gatherUpHeaderIds(payLoad){
    try{
        var headerIds = [];
        let delims = ['h1', 'h2', 'h3', 'h4'];
        const hs =
        $('iframe[name="ace_outer"]').contents().find('iframe')
            .contents().find('#innerdocbody').children('div').children(delims);
        $(hs).each(function () {
            const $parent = $(this).closest('.ace-line');
            const headerId =  $(this).data("data-id") || $parent.attr('sectionid');
            headerIds.push(headerId.toLowerCase())
        })
        headerIds.push(`${payLoad.padId}-general-channel`)
        const message = {
            type: 'ep_rocketchat',
            action: 'ep_rocketchat_joinToAllChannels',
            userId : payLoad.userId,
            padId: payLoad.padId,
            data: {
                headerIds : headerIds
            },
          };
        pad.collabClient.sendMessage(message);
    }catch(e){
        console.log(e)
    }
    

}
