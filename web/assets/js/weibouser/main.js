$(function() {
  $('#delete').on('show.bs.modal', function(evt) {
    // 删除对话框显示的时候，将要删除的记录ID添加到对话框的确认按钮上。
    // 这样在用户确认删除的时候，我们可以通过确认按钮就能获取需要操作的记录ID。
    var recordId = $(evt.relatedTarget).data('id');
    $('#btnDelete').data('id', recordId);
  });

  $('#btnDelete').click(function() {
    var recordId = $(this).data('id');
    var btn = $(this);
    btn.button('loading');
    $.ajax({
      url: 'WeiboUser/' + recordId,
      type: 'delete'
    }).then(function() {
    }, function(jqXHR, textStatus, errorThrown) {
      alert('删除失败: ' + errorThrown);
    }).always(function() {
      btn.button('reset');
      $('#delete').modal('hide');
    });
  });
});
