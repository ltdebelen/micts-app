$(document).ready(function () {
    // GENERIC FORM
    $('.formSelect').select2();
    $('.date_time').daterangepicker({
        timePicker: true,
        startDate: moment().startOf('hour'),
        endDate: moment().startOf('hour').add(32, 'hour'),
        locale: {
            format: 'YYYY-MM-DD HH:mm'
        }
    });

    // INTERFACE
    $('#tblInterface').DataTable();
    $('#interface_name').select2();
    $(function () {
        $('#interface_date_time').datetimepicker({
            format: 'YYYY-MM-DD HH:mm'
        });
    });

    // NODES
    $('#tblNodes').DataTable();
    $('#node_name').select2();
    $(function () {
        $('#node_date_time').datetimepicker({
            format: 'YYYY-MM-DD HH:mm'
        });
    });

    // SITE
    $('#tblSite').DataTable();
    $('#site_name').select2();
    $(function () {
        $('#site_date_time').datetimepicker({
            format: 'YYYY-MM-DD HH:mm'
        });
    });

});

// INTERFACE
function updateInterface(interface_id) {
    var interface_id = interface_id;

    $.ajax({
        url: '/get_interface_item',
        method: 'POST',
        data: { interface_id: interface_id },
        success: function (response) {
            $('#hidden_interface_item_id').val(response.result[0].id);
            $('#interface_name').val(response.result[0].interface_name).trigger('change');
            $('#interface_date_time').val(response.result[0].str_date_part);
            $('#interface_remarks').val(response.result[0].remarks);
            $('#updateInterfaceModal').modal('show');
        }
    });
}

function deleteInterface(interface_id) {
    var interface_id = interface_id;
    $('#hidden_interface_item_id_delete').val(interface_id);
    $('#deleteInterfaceModal').modal('show');
}

// NODES
function updateNode(node_id) {
    var node_id = node_id;

    $.ajax({
        url: '/get_node_item',
        method: 'POST',
        data: { node_id: node_id },
        success: function (response) {
            $('#hidden_node_item_id').val(response.result[0].id);
            $('#node_name').val(response.result[0].node_name).trigger('change');
            $('#node_date_time').val(response.result[0].str_date_part);
            $('#node_remarks').val(response.result[0].remarks);
            $('#updateNodeModal').modal('show');
        }
    });
}

function deleteNode(node_id) {
    var node_id = node_id;
    $('#hidden_node_item_id_delete').val(node_id);
    $('#deleteNodeModal').modal('show');
}

// SITE
function updateSite(site_id) {
    var site_id = site_id;

    $.ajax({
        url: '/get_site_item',
        method: 'POST',
        data: { site_id: site_id },
        success: function (response) {
            $('#hidden_site_item_id').val(response.result[0].id);
            $('#site_name').val(response.result[0].site_name).trigger('change');
            $('#site_date_time').val(response.result[0].str_date_part);
            $('#site_remarks').val(response.result[0].remarks);
            $('#updateSiteModal').modal('show');
        }
    });
}

function deleteSite(site_id) {
    var site_id = site_id;
    $('#hidden_site_item_id_delete').val(site_id);
    $('#deleteSiteModal').modal('show');
}

