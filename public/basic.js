$(document).ready(function () {
    var skip = 0;
    $("#LoginBtn").click(function () {
        $.post("http://localhost:3000/login",
            {
                username: $('#username').val(),
                password: $('#password').val()
            },
            function (data, status) {
                if (data.status == "success") {
                    $("#loginDiv").hide();
                    $('.hidden').show();
                    //alert($('#myList').val());
                    $.post("http://localhost:3000/getProjectInfo",
                        {
                            sortBy: $('#myList').val(),
                            skip: skip
                        },
                        function (data, status) {
                            $("#tbodyId").empty();
                            $("table").find('tbody').append(data.message);
                            $('#example').DataTable();
                        })
                } else {
                    alert(data.message);
                }
            });
    });
    $("#NextBtn").click(function () {
        skip = skip + 2;
        $.post("http://localhost:3000/getProjectInfo",
            {
                sortBy: $('#myList').val(),
                skip: skip
            },
            function (data, status) {
                $("#tbodyId").empty();
                $("table").find('tbody').append(data.message);
                $('#example').DataTable();
            })
    });
    $("#PreviousBtn").click(function () {
        if (skip >= 2) {
            skip = skip - 2;
            $.post("http://localhost:3000/getProjectInfo",
                {
                    sortBy: $('#myList').val(),
                    skip: skip
                },
                function (data, status) {
                    $("#tbodyId").empty();
                    $("table").find('tbody').append(data.message);
                    $('#example').DataTable();
                })
        }
    });
    $("#myList").change(function () {
        skip = 0;
        $.post("http://localhost:3000/getProjectInfo",
            {
                sortBy: $('#myList').val(),
                skip: skip
            },
            function (data, status) {
                $("#tbodyId").empty();
                $("table").find('tbody').append(data.message);
                $('#example').DataTable();
            })
    });

});
