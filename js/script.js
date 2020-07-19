var $xml;
var $login;
var $loggedin_user;
var token;
var tokenExpires;
var defaultEntity = "Kubra";
var defaultRole = "QA";
$(document).ready(function () {
    checkAuthentication();
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("href") // activated tab
        alert(target);
    });
});

//authentication functions
function login(email, password) {
    //this is called on a per user basis and is used by the security model to determine
    //an individual users rights.  this is part of the application flow and not part
    //of the authenticated users' grant of access
    $.ajax({
        type: "GET",
        async: false,
        url: "login.php",
        data: { email: email, password: password },
        success: function (data) {
            $login = $($.parseXML(data));
        },
        error: function (j, err) {
            alertMsg("error logging in: " + j.status);
        }
    }).fail(function () {
        alertMsg("AJAX Call failed on login");
    });
}
function loginForm_Login(email, password) {
    //this is called from the main login dialog and is used to determine access for the logged in user
    $.ajax({
        type: "GET",
        async: false,
        url: "login.php",
        data: { email: email, password: password },
        success: function (data) {
            $loggedin_user = $($.parseXML(data));
            if ($loggedin_user.find("Message").attr("text") == "") {
                //no error message, so assuming login successful
                $("#loginForm").modal("hide");
                //pull the tokens out
                token = $loggedin_user.find("Token").attr("value");
                tokenExpires = $loggedin_user.find("Token").attr("expires");
                //set your tokens in a cookie
                setCookie("Token", token);
                setCookie("TokenExpires", tokenExpires);
                //continue with the application flow
                $("#securityTables").removeClass("hiddenForm");
                getSecurityLists();
            }
            else
                //a message came is, so display it on the login form
                $("#loginForm_Message").html($loggedin_user.find("Message").attr("text")).fadeIn().fadeOut(5000);
        },
        error: function (j, err) {
            alertMsg("error logging in: " + j.status);
        }
    }).fail(function () {
        alertMsg("AJAX Call failed on login");
    });
}
function loginWithToken() {
    //this allows for tokenized login using previously a retrieved token and token expiration
    //this ensures no one has modified the cookie used to determine if tokenized login should be allowed
    $.ajax({
        type: "GET",
        async: false,
        url: "loginWithToken.php",
        data: { token: token, tokenExpires: tokenExpires },
        success: function (data) {
            $loggedin_user = $($.parseXML(data));
            if ($loggedin_user.find("Message").attr("text") == "Token combination not found") {
                //looks like the cookie was messed with, so ask for a login
                $("#loginForm").modal("show");
                $("#loginForm_Email").focus();
            }
            else {
                //tokenized login passed, continue with the application flow
                $("#securityTables").removeClass("hiddenForm");
                getSecurityLists();
            }
        },
        error: function (j, err) {
            alertMsg("error loginWithToken in: " + j.status);
        }
    }).fail(function () {
        alertMsg("AJAX Call failed on loginWithToken");
    });
}
function setCookie(name, value) {
    $.ajax({
        type: "GET",
        async: false,
        url: "setCookie.php",
        data: { name: name, value: value },
        success: function (data) {
            return (data);
        },
        error: function (j, err) {
            alertMsg("error on setCookie: " + j.status);
        }
    }).fail(function () {
        alertMsg("AJAX Call failed on setCookie");
    });
}
function getCookie(name) {
    $.ajax({
        type: "GET",
        async: false,
        url: "getCookie.php",
        data: { name: name },
        success: function (data) {
            return data;
        },
        error: function (j, err) {
            alertMsg("error on getCookie: " + j.status);
        }
    }).fail(function () {
        alertMsg("AJAX Call failed on getCookie");
    });
}
function loginForm_CancelLogin() {
    $("#loginForm").modal("hide");
}
function checkAuthentication() {
    $.ajax({
        type: "GET",
        async: false,
        url: "getCookie.php",
        data: { name: "Token" },
        success: function (data) {
            token = data;
            $.ajax({
                type: "GET",
                async: false,
                url: "getCookie.php",
                data: { name: "TokenExpires" },
                success: function (data) {
                    tokenExpires = data;
                    //do you have a token? (meaning you've logged in before)
                    if (!(token == "")) {
                        //you have a token, but has it expired?
                        dTokenExpires = new Date(tokenExpires);
                        dNow = new Date(Date.now());
                        if (dTokenExpires > dNow) {
                            //your token is still valid, so try tokenized login
                            loginWithToken();
                        }
                        else {
                            //your token has expired, so you need to log in
                            $("#loginForm").modal("show");
                            $("#loginForm_Email").focus();
                        }
                    }
                    else {
                        //you don't have a token, so you need to log in
                        $("#loginForm").modal("show");
                        $("#loginForm_Email").focus();
                    }
                },
                error: function (j, err) {
                    alertMsg("error on getCookie: " + j.status);
                }
            }).fail(function () {
                alertMsg("AJAX Call failed on getCookie");
            });
        },
        error: function (j, err) {
            alertMsg("error on getCookie: " + j.status);
        }
    }).fail(function () {
        alertMsg("AJAX Call failed on getCookie");
    });
}
function hasRight(entityName, roleName, rightName) {
    $right = $xml.find("Entity[name='" + entityName + "']").find("Role[name='" + roleName + "']").find("Rights");
    if ($right.attr(rightName) == undefined)
        return "";
    else
        return $right.attr(rightName);
}
function saveRoleRights() {
    entityrole_id = $("#Role option:selected").val();
    rights = "";
    $("#SelectedRoleRights").find("option").each(
        function (i, e) {
            rights += $(e).val() + "|";
        }
    );
    $.ajax({
        type: "POST",
        async: false,
        url: "saveRoleRights.php",
        data: { entityrole_id: entityrole_id, rights: rights },
        success: function (data) {
            //$("#btnSaveRoleRights").hide();
            $("#msgSaveRoleRights").show();
            if (data.length < 2) {
                $("#msgSaveRoleRights").removeClass("success");
                $("#msgSaveRoleRights").addClass("success");
                $("#msgSaveRoleRights").html("Success");
            }
            else {
                $("#msgSaveRoleRights").removeClass("fail");
                $("#msgSaveRoleRights").addClass("fail");
                $("#msgSaveRoleRights").html("failure: " + data);
            }
            $("#msgSaveRoleRights").fadeOut(5000, function () {
                $("#btnSaveRoleRights").show();
            });
            getSecurityLists();
        },
        error: function (j, err) {
            alertMsg("error on saveRoleRights: " + j.status);
        }
    }).fail(function () {
        alertMsg("AJAX Call failed on saveRoleRights");
    });
}

function getSecurityLists() {
    $.ajax({
        type: "GET",
        async: false,
        url: "getSecurityLists.php",
        success: function (data) {
            $xml = $($.parseXML(data));
            $allRights = $xml;
            //populateList("User", "User", "ID", "Email");
            //alertMsg($allRights.find("Entity").attr("Name"));
            populateList("Entity", "Entity", "ID", "Name", true, "");
            populateList("TabEntity", "Entity", "ID", "Name", true, "");
            //if (defaultEntity != "")
            //    $("#Entity option:contains(" + defaultEntity + ")").attr('selected', 'selected');
            populateList("Role", "Role", "ID", "Name", true,
                "Entity[Name='" + $("#Entity option:selected").text() + "']");
            if (defaultRole != "")
                $("#Role option:contains(" + defaultRole + ")").attr('selected', 'selected');
            roleSelected();
            loadAddNewRole_ModelRole();
            //populateList("Right", "ID", "Name");
        },
        error: function (j, err) {
            alertMsg("error on login: " + j.status);
        }
    }).fail(function () {
        alertMsg("AJAX Call failed on login");
    });
}
function loadAddNewRole_ModelRole() {
    var html = "";
    $allRights.find("Entity").each(
        function (i, e) {
            $(e).find("Role").each(
                function (j, f) {
                    html += "<option value='" + $(f).attr("ID") + "'>" + $(f).attr("Name") + " (" + $(e).attr("Name") + ")";
                });
        });
    $("#AddNewRole_ModelRole").html(html);
}
function populateList(ctl, list, keyValue, displayValue, defaultSet, filterSet) {
    html = "";
    if (filterSet == "")
        $filter = $allRights;
    else {
        $filter = $allRights.find(filterSet);
        //alertMsg($filter..parseXML);
        $filter = $filter.find("Roles");
    }
    $list = $filter.find(list).each(
        function (i, e) {
            if (defaultSet == true) {
                if (html == "")
                    html += "<option selected value='" + $(e).attr(keyValue) + "'>" + $(e).attr(displayValue);
                else
                    html += "<option value='" + $(e).attr(keyValue) + "'>" + $(e).attr(displayValue);
            }

            if ($(e).attr("Active") == "0")
                html += " (disabled)";
            html += "</option>";
        }
    );
    $("#" + ctl).html(html).prop("disabled", false);
    $("#btnAdd" + ctl).prop("disabled", false);
    $("#btnAdd" + ctl).removeClass("button-grey");
    //$("#btnEdit" + ctl).prop("disabled", true);
    //$("#btnEdit" + ctl).addClass("button-grey");
}

function showNewUserModal() {
    $("#NewUserModal").modal("show");
    $("#NewUserModal_ID").val("0");
    $("#NewUserModal_Email").val("");
    $("#NewUserModal_Password").val("");
    $("#NewUserModal_Email").focus();
    $("#NewUserModal_Title").html("Add User");
    $("#NewUserModal_DisableButton").hide();
    $("#NewUserModal_EnableButton").hide();
    $("#NewUserModal_DeleteButton").hide();
}
function showEditUserModal() {
    $user = $xml.find("User[ID='" + $("#User option:selected").val() + "']");
    $("#NewUserModal").modal("show");
    $("#NewUserModal_ID").val($("#User option:selected").val());
    $("#NewUserModal_Email").val($user.attr("Email"));
    $("#NewUserModal_Password").val($user.attr("Password"));
    $("#NewUserModal_Email").focus();
    $("#NewUserModal_Title").html("Edit User");
    $("#NewUserModal_DisableButton").hide();
    $("#NewUserModal_EnableButton").hide();
    if ($user.attr("Active") == "1")
        $("#NewUserModal_DisableButton").show();
    else
        $("#NewUserModal_EnableButton").show();
    $("#NewUserModal_DeleteButton").show();
}
function closeNewUserModal() {
    $("#NewUserModal").modal("hide");
}

function showNewEntityModal() {
    $("#MultiUseModal").modal("show");
    $("#MultiUseModal_Type").val("Entity");
    $("#MultiUseModal_ID").val("0");
    $("#MultiUseModal_Name").val("");
    $("#MultiUseModal_Title").html("Add Entity");
    $("#MultiUseModal_DisableButton").hide();
    $("#MultiUseModal_EnableButton").hide();
    $("#MultiUseModal_DeleteButton").hide();
}
function showEditEntityModal() {
    $entity = $xml.find("Entity[ID='" + $("#Entity option:selected").val() + "']");
    $("#MultiUseModal").modal("show");
    $("#MultiUseModal_Type").val("Entity");
    $("#MultiUseModal_ID").val($("#Entity option:selected").val());
    $("#MultiUseModal_Name").val($entity.attr("Name"));
    $("#MultiUseModal_Title").html("Edit Entity");
    $("#MultiUseModal_DisableButton").hide();
    $("#MultiUseModal_EnableButton").hide();
    if ($entity.attr("Active") == "1")
        $("#MultiUseModal_DisableButton").show();
    else
        $("#MultiUseModal_EnableButton").show();
    $("#MultiUseModal_DeleteButton").show();
}
function closeMultiUseModal() {
    $("#MultiUseModal").modal("hide");
}

function showEditRoleModal() {
    $entity = $xml.find("Role[ID='" + $("#Role option:selected").val() + "']");
    $("#MultiUseModal").modal("show");
    $("#MultiUseModal_Type").val("Role");
    $("#MultiUseModal_ID").val($("#Role option:selected").val());
    $("#MultiUseModal_Name").val($entity.attr("Name"));
    $("#MultiUseModal_Active").val($entity.attr("Active"));
    $("#MultiUseModal_Title").html("Edit Role");
    $("#MultiUseModal_DisableButton").hide();
    $("#MultiUseModal_EnableButton").hide();
    if ($entity.attr("Active") == "1")
        $("#MultiUseModal_DisableButton").show();
    else
        $("#MultiUseModal_EnableButton").show();
    $("#MultiUseModal_DeleteButton").hide();
}
function alertMsg(msg) {
    $("#PopupMessage").modal("show");
    $("#messagePopupMessage").html(msg);
}

function saveMultiUseModal(type, id, name, active, deleted) {
    id = $xml.find("Role[Name='" + $("#Role option:selected").text() + "']").attr("ID");
    //alertMsg("type: " + type + "\nid: " + id + "\nname: " + name + "\nactive: " + active + "\ndeleted: " + deleted);
    $.ajax({
        type: "POST",
        async: false,
        url: "updateMultiUse.php",
        data: { type: type, id: id, name: name, active: active, deleted: deleted },
        success: function (data) {
            if (data == "﻿success") {
                $entity = $xml.find("Role[ID='" + $("#Role option:selected").val() + "']");
                $entity.attr("Name", name);
                $entity.attr("Active", active);
                if (active=="1")
                    $("#Role option:selected").text(name);
                else
                    $("#Role option:selected").text(name + " (disabled)");
                //$entity = $xml.find("Role[ID='" + $("#Role option:selected").val() + "']");
                //alertMsg($entity.attr("Name"));
            }
            else
                alertMsg("server side error saveMultiUseModal\n" + data);
        },
        error: function (j, err) {
            alertMsg("error during saveMultiUseModal: " + j.status);
        }
    }).fail(function () {
        alertMsg("AJAX Call failed on saveMultiUseModal");
    });
    $("#MultiUseModal").modal("hide");
}
function addRole(id) {
    role = $("#AddNewRole_RoleName").val();
    entity_id = $("#Entity option:selected").val();
    entity = $("#Entity option:selected").text();
    //alertMsg(role + "\n" + entity + "\n" + entity_id + "\n" + id);
    $.ajax({
        type: "POST",
        async: false,
        url: "addRole.php",
        data: { role: role, entity_id: entity_id, entity: entity, id: id },
        success: function (data) {
            if (data == "﻿success") {
                $("#AddNewRole_RoleName").val("");
                changeAddNewRole_RoleName();
                getSecurityLists();
                populateList("Role", "Role", "ID", "Name", true,
                    "Entity[Name='" + $("#Entity option:selected").text() + "']");
                $("#Entity option:contains(" + entity + ")").attr("selected", "selected");
                $("#Role option:contains(" + role + ")").attr("selected", "selected");
                roleSelected();
            }
            else
                alertMsg(data);
        },
        error: function (j, err) {
            alertMsg("error saving user: " + j.status);
        }
    }).fail(function () {
        alertMsg("AJAX Call failed on saving user");
    });
}
//Role / Rights buttons
function showRoleRights(entity, role) {
    //set up UI headings
    $("#roleRights_Header").html("Manage rights for " + entity + "'s " + role + " role");
    $("#addNewRoleHeading").html("Add New Role in " + entity);
    changeAddNewRole_RoleName();

    allHtml = "";
    selectedHtml = "";
    //of all available rights
    $all = $allRights.find("Right").each(
        function (i, e) {
            $entity = $allRights.find("Entity[Name='" + entity + "']");
            $role = $entity.find("Role[Name='" + role + "']");
            right = $role.attr("Rights");
            //alertMsg(right);
            //which ones are on this role
            if (right.indexOf($(e).attr("ID")) > -1) {
                selectedHtml += "<option value='" + $(e).attr("ID") + "'>" + $(e).attr("Name");
                if ($(e).attr("Active") == "0")
                    selectedHtml += " (disabled)";
                selectedHtml += "</option>";
            }
            else {
                allHtml += "<option value='" + $(e).attr("ID") + "'>" + $(e).attr("Name");
                if ($(e).attr("Active") == "0")
                    allHtml += " (disabled)";
                allHtml += "</option>";
            }
        }
    );
    $("#AllRoleRights").html(allHtml);
    $("#SelectedRoleRights").html(selectedHtml);
    $("#SelectedRoleRights").sortSelect();
    $("#AllRoleRights").sortSelect();
}
function changeAddNewRole_RoleName() {
    //alertMsg("here");
    if ($("#AddNewRole_RoleName").val() == "") {
        $("#btnAddBlankRole").prop("disabled", true);
        $("#btnAddBlankRole").removeClass("button-grey");
        $("#btnAddBlankRole").addClass("button-grey");

        $("#btnAddModelRole").prop("disabled", true);
        $("#btnAddModelRole").removeClass("button-grey");
        $("#btnAddModelRole").addClass("button-grey");
    }
    else {
        $("#btnAddBlankRole").prop("disabled", false);
        $("#btnAddBlankRole").removeClass("button-grey");

        $("#btnAddModelRole").prop("disabled", false);
        $("#btnAddModelRole").removeClass("button-grey");
    }
}
function changeAddNewEntity_EntityName() {
    //alertMsg("here");
    if ($("#AddNewEntity_EntityName").val() == "") {
        $("#btnAddBlankEntity").prop("disabled", true);
        $("#btnAddBlankEntity").addClass("button-grey");
    }
    else {
        $("#btnAddBlankEntity").prop("disabled", false);
        $("#btnAddBlankEntity").removeClass("button-grey");
    }
}
function moveAllRoleRightsRight() {
    $("#AllRoleRights option").each(
        function (key, value) {
            $('#SelectedRoleRights')
                .append($("<option value='" + value.value + "'>" + value.text + "</option>"));
            $("#AllRoleRights option[value='" + value.value + "']").remove();
        }
    );
    $("#SelectedRoleRights").sortSelect();
}
function moveOneRoleRightRight() {
    $("#AllRoleRights option:selected").each(
        function (key, value) {
            $('#SelectedRoleRights')
                .append($("<option value='" + value.value + "'>" + value.text + "</option>"));
            $("#AllRoleRights option[value='" + value.value + "']").remove();
        }
    );
    $("#SelectedRoleRights").sortSelect();
}
function moveOneRoleRightLeft() {
    $("#SelectedRoleRights option:selected").each(
        function (key, value) {
            $('#AllRoleRights')
                .append($("<option value='" + value.value + "'>" + value.text + "</option>"));
            $("#SelectedRoleRights option[value='" + value.value + "']").remove();
        }
    );
    $("#AllRoleRights").sortSelect();
}
function moveAllRoleRightsLeft() {
    $("#SelectedRoleRights option").each(
        function (key, value) {
            $('#AllRoleRights')
                .append($("<option value='" + value.value + "'>" + value.text + "</option>"));
            $("#SelectedRoleRights option[value='" + value.value + "']").remove();
        }
    );
    $("#AllRoleRights").sortSelect();
}
$.fn.extend({
    sortSelect() {
        let options = this.find("option"),
            arr = options.map(function (_, o) { return { t: $(o).text(), v: o.value }; }).get();

        arr.sort((o1, o2) => { // sort select
            let t1 = o1.t.toLowerCase(),
                t2 = o2.t.toLowerCase();
            return t1 > t2 ? 1 : t1 < t2 ? -1 : 0;
        });

        options.each((i, o) => {
            o.value = arr[i].v;
            $(o).text(arr[i].t);
        });
    }
});

//function showRightsDual(entity, role) {
//    $("#dualRightsModal").modal("show");
//    $("#dualRightsModal_Header").html("Manage rights for " + entity + "'s " + role + " role");
//    allHtml = "";
//    selectedHtml = "";
//    $all = $allRights.find("Right").each(
//        function (i, e) {
//            $entity = $loggedin_user.find("Entity[name='" + entity + "']");
//            $role = $entity.find("Role[name='" + role + "']");
//            $right = $role.find("Rights[" + $(e).attr("Name") + "='1']");
//            if ($right.length == 1) {
//                selectedHtml += "<option value='" + $(e).attr("ID") + "'>" + $(e).attr("Name");
//                if ($(e).attr("Active") == "0")
//                    selectedHtml += " (disabled)";
//                selectedHtml += "</option>";
//            }
//            else {
//                allHtml += "<option value='" + $(e).attr("ID") + "'>" + $(e).attr("Name");
//                if ($(e).attr("Active") == "0")
//                    allHtml += " (disabled)";
//                allHtml += "</option>";
//            }
//        }
//    );
//    $("#AllRights").html(allHtml);
//    $("#SelectedRights").html(selectedHtml);
//    $("#SelectedRights").sortSelect();
//    $("#AllRights").sortSelect();
//}
function closeDualRightsModal() {
    $("#dualRightsModal").modal("hide");
}

function saveUser(id, email, password, active, delete_user) {
    $.ajax({
        type: "POST",
        async: false,
        url: "updateUser.php",
        data: { id: id, email: email, password: password, active: active, delete_user: delete_user },
        success: function (data) {
            if (data == "﻿success") {
                $("#NewUserModal").modal("hide");
                getSecurityLists();
            }
            else
                alertMsg("server side error saving user\n" + data);
        },
        error: function (j, err) {
            alertMsg("error saving user: " + j.status);
        }
    }).fail(function () {
        alertMsg("AJAX Call failed on saving user");
    });
}

function userSelected() {
    $("#btnEditUser").prop("disabled", false);
    $("#btnEditUser").removeClass("button-grey");
    $("#Entity").prop("disabled", false);
    //$("#btnAddEntity").prop("disabled", false);
    //$("#btnAddEntity").removeClass("button-grey");
    $("#permissionsSummary").html(getPermissionSummary());
    populateList("Entity", "ID", "Name", true);
}
function entitySelected() {
    //$("#btnEditEntity").prop("disabled", false);
    //$("#btnEditEntity").removeClass("button-grey");
    $("#Role").prop("disabled", false);
    $("#btnAddRole").prop("disabled", false);
    $("#btnAddRole").removeClass("button-grey");
    populateList("Role", "Role", "ID", "Name", true,
        "Entity[Name='" + $("#Entity option:selected").text() + "']");

    showRoleRights($("#Entity option:selected").text(), $("#Role option:selected").text());
}
function roleSelected() {
    $("#btnEditRole").prop("disabled", false);
    $("#btnEditRole").removeClass("button-grey");
    $("#Right").prop("disabled", false);
    $("#btnAddRight").prop("disabled", false);
    $("#btnAddRight").removeClass("button-grey");
    //populateList("Right", "ID", "Name");
    showRoleRights($("#Entity option:selected").text(), $("#Role option:selected").text());
}
function rightSelected() {
    $("#btnEditRight").prop("disabled", false);
    $("#btnEditRight").removeClass("button-grey");
}

function getPermissionSummary() {
    $user = $xml.find("User[ID='" + $("#User option:selected").val() + "']");
    login($user.attr("Email"), $user.attr("Password"));
    rights = "";

    $login.find("Entity").each(function () {
        rights += "Entity: " + $(this).attr("name") + "<br>";
        $(this).find("Role").each(function () {
            rights += "&nbsp;&nbsp;&nbsp;&nbsp;Role: " + $(this).attr("name") + "<br>";
            $(this).find("Rights").each(function () {
                rights += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rights: ";
                $.each(this.attributes, function (i, attrib) {
                    rights += attrib.name + ", ";
                });
            })
            rights += "<br>";
        })
        //this.find("Role").each(function () {
        //    this.attr.each(function () {

        //    });
        //});
        //rights = "";
    });
    return rights;
}
