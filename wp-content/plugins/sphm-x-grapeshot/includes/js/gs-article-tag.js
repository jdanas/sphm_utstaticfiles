function sphm_gs_send_request(post_id, action_request){
    jQuery.ajax({
        type : "post",
        dataType : "json",
        url : sphm_gs_ajax_url,
        data : {action: "sphm_gs_hook_ajax_request_to_gs", post_id : post_id, action_request : action_request},
        success: function(response) {
            
        }
    });
}