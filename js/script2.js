pFullPath = "";
titleImages = "";
$(document).ready(function () {
    $("#txtPictureImagePath").focus(function () { $(this).select(); });
    $("#txtPartImagePath").focus(function () { $(this).select(); });
    $("#divProjectImagesFullScreenImage").hide();
    $("#divProjectImagesFullScreenButtonBar").hide();
    max_height = 400;
    screen_width = document.documentElement.offsetWidth;
    //showSystemMessageModal(screen_width);
    if (screen_width < 1300)
        max_height = 370;
    if (screen_width < 1050)
        max_height = 380;
    if (screen_width < 820)
        max_height = 355;
    if (screen_width < 790)
        max_height = 320;
    if (screen_width < 750)
        max_height = 280;
    if (screen_width < 690)
        max_height = 250;
    if (screen_width < 660)
        max_height = 240;
    if (screen_width < 570)
        max_height = 210;
    if (screen_width < 430)
        max_height = 155;
    if (screen_width < 390)
        max_height = 155;
    if (screen_width < 374)
        max_height = 150;
    if (screen_width < 350)
        max_height = 150;
    user = "";
    $("#h").html($(window).width());
    $('#editForumMessage').summernote({ height: 200 });
    getTitleImages();

    $.ajax({
        type: "GET",
        async: false,
        url: "getCookie.php?name=user",
        success: function (data) {
            //msg("getCookie: " + data);
            if (data == "") {
                user = "({\"user\": {\"email\": \"\", \"username\": \"Fake User\", \"zipcode\": \"\", ";
                user += "\"password\": \"\", \"ts\": \"\", \"id\": \"0\", \"level\": \"standard\"}})";
                user = eval(user);
            }
            else {
                user = eval("(" + data + ")");
                $.ajax({
                    type: "GET",
                    async: false,
                    url: "getCookieUser.php",
                    data: "id=" + user.user.id,
                    success: function (data) {
                        //msg("get cookie user: " + data);
                        user = eval("(" + data + ")");
                        //msg("get cookie user object: " + JSON.stringify(user));
                    }
                });
                if ("user" in user) {
                    $("#liRegister").html("<a href=\"" + compileLink("#MyGarage") + "\" class=\"blackmenu\" onclick='showPage(\"myGaragePage.php\", \"myGarageMenu\");'>My Garage</a>");
                    $("#liLogin").html("<a href=\"" + compileLink("#Home") + "\" class=\"blackmenu\" onclick='logOut();'>Sign Out</a>");
                    $("#liRegister2").html("<a href=\"" + compileLink("#MyGarage") + "\" class=\"redlogin\" onclick='showPage(\"myGaragePage.php\", \"myGarageMenu\");'>My Garage</a>");
                    $("#liLogin2").html("<a href=\"" + compileLink("#Home") + "\" class=\"redlogin\" onclick='logOut();'>SIGN OUT</a>");
                }
            }
            //msg("get cookie: " + data);
        }
    });

    if (location.toString().indexOf("#Photos") > 0)
        showPage("photos.php", "photosMenu");
    if (location.toString().indexOf("#Home") > 0)
        showPage("home.php", "homeMenu");
    if (location.toString().indexOf("#") == -1)
        showPage("home.php", "homeMenu");
    if (location.toString().indexOf("#Project") > 0)
        //showPage("myProject.php", "myGarageMenu");
        showPage("myNewProject.php", "myGarageMenu");
    if (location.toString().indexOf("#Parts") > 0)
        showPage("parts.php", "partsMenu");
    if (location.toString().indexOf("#Pros") > 0)
        showPage("pros.php", "prosMenu");
    if (location.toString().indexOf("#Course") > 0)
        showPage("course.php", "courseMenu");
    if (location.toString().indexOf("#Forum") > 0)
        showPage("forum.php", "forumMenu");
    if (location.toString().indexOf("?ProjectPic") > 0)
        showPage("myNewProject.php", "photosMenu");
    if (location.toString().indexOf("#NewsManagement") > 0)
        showPage("newsManagement.php", "myGarageMenu");
    if (location.toString().indexOf("#UsersManagement") > 0)
        showPage("usersManagement.php", "myGarageMenu");
    if (location.toString().indexOf("#StockPhotosManagement") > 0)
        showPage("stockPhotosManagement.php", "myGarageMenu");
    if (location.toString().indexOf("#MyGarage") > 0)
        showPage("myGaragePage.php", "myGarageMenu");
    if (location.toString().indexOf("#TitlePictureManagement") > 0) 
        showPage("titlePictureManagement.php", "myGarageMenu");
    if (location.toString().indexOf("?ProjectPic") > 0) {
        querystring = location.toString().substring(location.toString().indexOf("?ProjectPic") + 1, 1000).split("&");
        pFullPath = "images/projects/" + querystring[0].substring(querystring[0].indexOf("=") + 1, 1000) + ".jpg";
        t = querystring[1].substring(querystring[1].indexOf("=") + 1, 1000).split("#");
        projectID = t[0];
        showNewProject(projectID, pFullPath);
        //alert("project: " + projectID + "\npic: " + pFullPath);
    }
    if (location.toString().indexOf("?ProjectPart") > 0) {
        querystring = location.toString().substring(location.toString().indexOf("?ProjectPart") + 1, 1000).split("&");
        pFullPath = "images/projects/" + querystring[0].substring(querystring[0].indexOf("=") + 1, 1000) + ".jpg";
        t = querystring[1].substring(querystring[1].indexOf("=") + 1, 1000).split("#");
        projectID = t[0];
        showNewPart(projectID, pFullPath);
        //alert("project: " + projectID + "\npic: " + pFullPath);
    }
    $('a').click(function () {
        $('a').removeClass("active");
        $(this).addClass("active");
    });
    $("#homeMenu").attr("href", compileLink("#Home"));
    $("#photoMenu").attr("href", compileLink("#Photos"));
    $("#partsMenu").attr("href", compileLink("#Parts"));
    $("#forumMenu").attr("href", compileLink("#Forum"));
    $("#lnkLoginLogin").attr("href", compileLink("#MyGarage"));
    $("#lnkRegisterRegister").attr("href", compileLink("#MyGarage"));
});
function msg(msg) {
    if (location.hostname == "localhost")
    //if (user.user.id == "1")
        showSystemMessageModal(msg);
}
function log(msg) {
    $.ajax({
        type: "POST",
        async: false,
        url: "log.php",
        data: "msg=" + msg,
        success: function (data) {
            //msg("log: " + data);
        },
        error: function (j, err) {
            msg("error logging: " + j.status);
        }
    }).fail(function () {
        msg("AJAX Call failed on log");
    });
}
function sendMail() {
    if (validateFields()) {
        $.ajax({
            type: "POST",
            url: "email.php",
            data: "name=" + $("#nameText").val() +
                    "&email=" + $("#emailText").val() +
                    "&phone=" + $("#phoneText").val() +
                    "&subject=" + $("#subjectText").val() +
                    "&body=" + $("#bodyTextArea").val(),
            success: function (data) {
                show("thankspage");
                if (data == "success")
                    $("#emailResults").html("Thanks for contacting us.<br /><br />Someone will respond to your request shortly.");
                else if (data == "error")
                    $("#emailResults").html("Something went wrong and we were unable to send your mail.<br /><br />Please try again later.");
                else
                    $("#emailResults").html(data);
            }
        });
    }
}
function saveFile(type, oData) {
    $.ajax(
    {
        type: "POST",
        url: "saveJSON.php",
        data: { fileType: type, json: JSON.stringify(oData) },
        success: function (data) {
            ; // document.write(type + " save: " + data + "<br>");
        }
    });
}
function loadBottom() {
    $.ajax(
    {
        type: "POST",
        url: "bottom.php",
        success: function (data) {
        }
    });
}
function readFile(type) {
    return;
    $.ajax(
    {
        type: "POST",
        url: "readJSON.php",
        async: false,
        data: { fileType: type },
        success: function (data) {
            if (type == "static") {
                s = eval("(" + data + ")");
                //displayAdviceArticles();
                //showSystemMessageModal("Specializations: " + s.Specializations.length);
            }
            else {
                d = eval("(" + data + ")");
                //displayLogins();
                //document.write("Listings: " + d.Listings.length + "<br>");
            }
        }
    });
}
function openLink(articleLocation) {
    //$("#menu ul ul").slideUp();
    //$("#home").slideUp();
    $("#Panoramic").hide(500);
    if ((articleLocation == "Sellers") || (articleLocation == "Buyers")) {
        for (var i = 0; i < s.Subject.length; i++) {
            if (s.Subject[i].Name == articleLocation) {
                var html = "<ul>";
                for (var j = 0; j < s.Subject[i].Articles.length; j++) {
                    html += "<li><a href='#' onclick='showPage(\"" + s.Subject[i].Articles[j].Location + "\", \"\");'>" + s.Subject[i].Articles[j].Name + "</a></li>";
                }
                html = "<table cellspacing=0 cellpadding=5 border=1 width=100%><tr><td width=300 valign=top>" + html;
                html += "</ul></td><td valign=top><div id='articleText'>&nbsp;</div></td></tr></table><table><tr height=\"12px\"><td /></tr></table>";
                $("#home").slideUp("slow", function () {
                    $("#content").slideUp("slow", function () {
                        $("#content").html(html);
                        $("#content").slideDown();
                    });
                });
            }
        }
    }
}
function showPage(pageName, css) {
    //return;
    $(css).removeClass("active");
    $(css).addClass("active");

    if ((pageName.substring(0, 7) == "http://") || (pageName.substring(0, 8) == "https://")) {
        window.open(pageName);
    }
    else {
        $("#MainBody").slideUp("slow", function () {
            if (
                (
                    (pageName == "newsManagement.php") ||
                    (pageName == "usersManagement.php") ||
                    (pageName == "titlePictureManagement.php") ||
                    (pageName == "stockPhotosManagement.php")
                ) &&
                    (user.user.level == "standard")
            ){
                pageName = "home.php";
            }
            if (
                (
                    (pageName == "myGaragePage.php")
                ) &&
                    (user.user.username == "Fake User")
            ) {
                pageName = "home.php";
            }
            $("#bottomContainer").hide();
            $("#placeHolder").slideUp("slow", function () {
                $.ajax(
                {
                    type: "GET",
                    url: pageName,
                    success: function (data) {
                        //msg("show page: " + data);
                        $("#placeHolder").html(data);
                        if (pageName == "photos.php") {
                            $("#header").show();
                            PartHolding = "";
                            PhotoHolding = "";
                            $("#header").html("<img id=\"headerImage\" src=\"images/" + getTitlePictureForScreen("Photos") + "\" style='width:100%;height:" + max_height + "px;' />");
                            $.ajax(
                            {
                                type: "GET",
                                url: "getImages.php",
                                success: function (data) {
                                    //msg("get images: " + data);
                                    stockImages = eval(data);
                                    $("#stockImages").html(buildPhotosPage());
                                },
                                error: function (j, err) {
                                    showSystemMessageModal("error getting stock images: " + j.status);
                                }
                            });
                        }
                        else if (pageName == "stockPhotosManagement.php"){
                            $("#header").show();
                            $("#header").html("<img id=\"headerImage\" src=\"images/" + getTitlePictureForScreen("My Garage") + "\" style='width:100%;height:" + max_height + "px;' />");
                            $("#frmUpload").submit(function (e) {
                                e.preventDefault();
                            });
                            $.ajax(
                            {
                                type: "GET",
                                url: "getStockImages.php",
                                success: function (data) {
                                    stockImages = eval("(" + data + ")");
                                    $("#stockImages").html(buildStockImages());
                                },
                                error: function (j, err) {
                                    showSystemMessageModal("error getting stock images: " + j.status);
                                }
                            });
                        }
                        else if (pageName == "usersManagement.php") {
                            $("#header").show();
                            $("#header").html("<img id=\"headerImage\" src=\"images/" + getTitlePictureForScreen("My Garage") + "\" style='width:100%;height:" + max_height + "px;' />");
                            $.ajax(
                            {
                                type: "GET",
                                url: "getUsers.php",
                                success: function (data) {
                                    //msg("users: " + data);
                                    users = eval(data);
                                    $("#userCount1").html(users.users.length + " Items");
                                    $("#userCount2").html(users.users.length + " Items");
                                    $("#userFullScreenContent").html(buildFullScreenUsers());
                                    //$("#userMobileContent").html(buildMobileUsers());
                                    $('#tblFullScreenUsers').DataTable({ 'searching': false, 'lengthChange': false });

                                    //msg("getNews: " + data);
                                },
                                error: function (j, err) {
                                    showSystemMessageModal("error getting News: " + j.status);
                                }
                            });
                        }
                        else if (pageName == "myGaragePage.php") {
                            $("#header").show();
                            PartHolding = "";
                            PhotoHolding = "";
                            //msg(JSON.stringify(user));
                            if (user.user.coverphoto == "")
                                $("#header").html("<img id='headerImage' src='images/" + getTitlePictureForScreen("My Garage") + "' style='width:100%;height:" + max_height + "px;' />");
                            else
                                $("#header").html("<img id='headerImage' src='images/" + user.user.coverphoto + "' style='width:100%;height:" + max_height + "px;' />");
                            if (user.user.imagePath == "")
                                $("#imgMyGaragePersonalPhoto").attr("src", "images/noprofilepicture.jpg");
                            else
                                $("#imgMyGaragePersonalPhoto").attr("src", "images/" + user.user.imagePath);
                            $("#frmUpload").submit(function (e) {
                                e.preventDefault();
                            });
                            
                            if (user != undefined) {
                                if ("username" in user.user) {
                                    $("#username").html(user.user.username + " (" + user.user.level + ")");
                                    getUserProjects(user.user.id);
                                    if (user.user.level == "admin")
                                        $("#manageNewsButton").show();
                                    else
                                        $("#manageNewsButton").hide();
                                    if (user.user.level == "admin")
                                        $("#manageUsersButton").show();
                                    else
                                        $("#manageUsersButton").hide();
                                    if (user.user.level == "admin")
                                        $("#manageStockPhotosButton").show();
                                    else
                                        $("#manageStockPhotosButton").hide();
                                    if (user.user.level == "admin")
                                        $("#manageTitlePicturesButton").show();
                                    else
                                        $("#manageTitlePicturesButton").hide();
                                }
                            }
                            //getUserProjects(user.user.id);
                        }
                        else if (pageName == "myProject.php") {
                            $("#header").show();
                            if (typeof projectID === 'undefined') {
                                showPage("myGaragePage.php", "myGarageMenu");
                            }
                            getProject(projectID);
                            //msg("User:\n" + JSON.stringify(user) + "\n\nProject:\n" + JSON.stringify(project));
                            $("#header").html("<img id=\"headerImage\" src=\"images/" + getTitlePictureForScreen("My Garage") + "\" style='width:100%;height:" + max_height + "px;' />");
                            if (project.project.userCoverPhoto == "")
                                $("#header").html("<img id='headerImage' src='images/" + getTitlePictureForScreen("My Garage") + "' style='width:100%;height:" + max_height + "px;' />");
                            else
                                $("#header").html("<img id='headerImage' src='images/" + project.project.userCoverPhoto + "' style='width:100%;height:" + max_height + "px;' />");
                            if (project.project.userImage == "") 
                                if (user.user.imagePath == "") 
                                    $("#imgMyGaragePersonalPhoto").attr("src", "images/noprofilepicture.jpg");
                                else 
                                    $("#imgMyGaragePersonalPhoto").attr("src", "images/" + user.user.imagePath);
                            else 
                                $("#imgMyGaragePersonalPhoto").attr("src", "images/" + project.project.userImage);
                            if (projectID == "-1") {
                                $("#projectName").html("<h3>--New Project--</h3>");
                                $("#myProjectID").val(projectID);
                                $("#myProjectTMUserID").val(user.user.id);
                                $("#btnMyProjectDelete").addClass("disabled");
                                $("#btnMyProjectSave").addClass("disabled");
                                $("#btnAddProjectPhoto").addClass("disabled");
                                $("#btnAddProjectPart").addClass("disabled");
                                $("#btnMyProjectSave").attr("href", "#Project");
                            }
                            else {
                                $("#projectName").html(decode(project.project.name));
                                $("#myProjectID").val(project.project.id);
                                $("#myProjectTMUserID").val(project.project.userID);
                                $("#myProjectName").val(decode(project.project.name));
                                $("#myProjectDescription").val(decode(project.project.description));
                                $("#myProjectYear").val(decode(project.project.year));
                                $("#myProjectMake").val(decode(project.project.make));
                                $("#myProjectModel").val(decode(project.project.model));
                                $("#myProjectTrim").val(decode(project.project.trim));
                                $("#myProjectBuiltBy").val(decode(project.project.builtby));
                                validateProjectForm();
                            }
                            if (project.project.userID == user.user.id) {
                                $("#btnAddProjectPhoto").removeClass("disabled");
                                $("#btnAddProjectPart").removeClass("disabled");
                                $("#btnMyProjectSave").removeClass("disabled");
                                $("#btnMyProjectDelete").removeClass("disabled");
                                $("#divUpdateCoverPhoto").show();
                                $("#divEditGaragePersonalPhoto").show();
                            }
                            else {
                                $("#btnAddProjectPhoto").addClass("disabled");
                                $("#btnAddProjectPart").addClass("disabled");
                                $("#btnMyProjectSave").addClass("disabled");
                                $("#btnMyProjectDelete").addClass("disabled");
                                $("#divUpdateCoverPhoto").hide();
                                $("#divEditGaragePersonalPhoto").hide();
                            }
                        }
                        else if (pageName == "myNewProject.php") {
                            if (typeof projectID === 'undefined') {
                                showPage("myGaragePage.php", "myGarageMenu");
                            }
                            $("#header").hide();
                            getProject(projectID);
                            //                            getProject(3);
                            calculateImageSizes();
                            //alert("project: " + JSON.stringify(project));
                            //                            showNewProjectImages("images/projects/1.jpg");
                            showNewProjectImages(pFullPath);
                            if (project.project.userImage == "")
                                $("#imgNewProjectPersonalPhoto").attr("src", "images/noprofilepicture.jpg");
                            else
                                $("#imgNewProjectPersonalPhoto").attr("src", "images/" + project.project.userImage);
                            $("#pageTitle").html("<h3>Project: " + decode(project.project.name) + "</h3>");
                            $("#btnSharePictureImageLink").attr("onclick", "showPictureLinkModal('" + pFullPath + "');");
                            $("#btnSavePhotoToProject").attr("onclick", "showSavePhotoToProjectModal('" + pFullPath + "');");
                            $("#MyNewProjectProjectName").html(decode(project.project.name));
                            $("#MyNewProjectDescription").html(decode(project.project.description));
                            if (user.user.id == "0")
                                $("#btnSavePhotoToProject").addClass("disabled");
                            else
                                $("#btnSavePhotoToProject").removeClass("disabled");
                            $("#MyNewProjectYearMakeModel").html(
                                decode(project.project.year) + ", " +
                                decode(project.project.make) + ", " +
                                decode(project.project.model));
                            //msg("project: " + JSON.stringify(project));
                        }
                        else if (pageName == "myNewPart.php") {
                            if (typeof projectID === 'undefined') {
                                showPage("myGaragePage.php", "myGarageMenu");
                            }
                            $("#header").hide();
                            getProject(projectID);
                            //                            getProject(3);
                            calculatePartSizes();
                            //msg("project: " + JSON.stringify(project));
                            //                            showNewProjectImages("images/projects/1.jpg");
                            showNewPartImages(pFullPath);
                            imgElem = -1;
                            for (var i = 0; i < project.parts.length; i++) {
                                if (pFullPath == project.parts[i].fullpath)
                                    imgElem = i;
                            }

                            $("#btnSharePartImageLink").attr("onclick", "showPartLinkModal('" + pFullPath + "');");
                            $("#btnSavePartToProject").attr("onclick", "showSavePartToProjectModal('" + pFullPath + "');");
                            if (project.project.userImage == "")
                                $("#imgNewProjectPersonalPhoto").attr("src", "images/noprofilepicture.jpg");
                            else
                                $("#imgNewProjectPersonalPhoto").attr("src", "images/" + project.project.userImage);
                            $("#pageTitle").html("<h3>Project: " + decode(project.project.name) + "</h3>");
                            $("#MyNewProjectProjectName").html(decode(project.project.name));
                            $("#MyNewProjectDescription").html(decode(project.parts[imgElem].description));
                            if (user.user.id == "0")
                                $("#btnSavePartToProject").addClass("disabled");
                            else
                                $("#btnSavePartToProject").removeClass("disabled");
                            $("#MyNewProjectYearMakeModel").html(
                                decode(project.project.year) + ", " +
                                decode(project.project.make) + ", " +
                                decode(project.project.model));
                            //msg("project: " + JSON.stringify(project));0
                        }
                        else if (pageName == "home.php") {
                            $("#header").show();
                            PartHolding = "";
                            PhotoHolding = "";
                            $("#header").html(buildHomePagePanoramic());
                            $("#myCarousel").carousel({ interval: 7000 });
                            $.ajax(
                            {
                                type: "GET",
                                url: "getNews.php",
                                success: function (data) {
                                    news = eval("(" + data + ")");
                                    $("#newsCount1").html(getNewsCount() + " Items");
                                    $("#newsCount2").html(getNewsCount() + " Items");
                                    $("#newsFullScreenContent").html(buildFullScreenNews());
                                    $("#newsMobileContent").html(buildMobileNews());
                                    //msg("getNews: " + data);
                                },
                                error: function (j, err) {
                                    showSystemMessageModal("error getting News: " + j.status);
                                }
                            });
                        }
                        else if (pageName == "parts.php") {
                            $("#header").show();
                            PartHolding = "";
                            PhotoHolding = "";
                            $("#header").html("<img id=\"headerImage\" src=\"images/" + getTitlePictureForScreen("Parts & Tools") + "\" style='width:100%;height:" + max_height + "px;' />");
                            $.ajax(
                            {
                                type: "GET",
                                url: "getParts.php",
                                success: function (data) {
                                    //msg("get parts: " + data);
                                    stockParts = eval(data);
                                    $("#stockParts").html(buildPartsPage());
                                },
                                error: function (j, err) {
                                    showSystemMessageModal("error getting parts: " + j.status);
                                }
                            });
                        }
                        else if (pageName == "pros.php") {
                            $("#header").show();
                            $("#header").html("<img id=\"headerImage\" src=\"images/" + getTitlePictureForScreen("Find Local Pros") + "\" style='width:100%;height:" + max_height + "px;' />");
                        }
                        else if (pageName == "course.php") {
                            $("#header").show();
                            $("#header").html("<img id=\"headerImage\" src=\"images/" + getTitlePictureForScreen("Courses") + "\" style='width:100%;height:" + max_height + "px;' />");
                        }
                        else if (pageName == "forum.php") {
                            $("#header").show();
                            PartHolding = "";
                            PhotoHolding = "";
                            $("#header").html("<img id=\"headerImage\" src=\"images/" + getTitlePictureForScreen("Forum") + "\" style='width:100%;height:" + max_height + "px;' />");
                            $.ajax(
                            {
                                type: "GET",
                                url: "getForum.php?ParentObject=Forum&projectID=-1",
                                success: function (data) {
                                    //msg("forum: " + data);
                                    forum = eval("(" + data + ")");
                                    //msg(forum.forum.length);
                                    //msg(forum.forum[0].subForums.length);
                                    html = "<table border='0' width='100%'><tr><td>";
                                    html += buildForumTable(forum, 0, "0", "forum");
                                    html += "</td></tr></table>";
                                    //msg("html: " + html);
                                    $("#forumFullScreenContent").html(html);
                                    //$("#forumCount").html(users.users.length + " Items");
                                    //$("#userFullScreenContent").html(buildFullScreenUsers());
                                    ////$("#userMobileContent").html(buildMobileUsers());
                                    //$('#tblFullScreenUsers').DataTable({ 'searching': false, 'lengthChange': false });

                                    //msg("getNews: " + data);
                                },
                                error: function (j, err) {
                                    showSystemMessageModal("error getting forum: " + j.status);
                                }
                            });
                        }
                        else if (pageName == "titlePictureManagement.php") {
                            $("#header").show();
                            $("#header").html("<img id=\"headerImage\" src=\"images/" + getTitlePictureForScreen("My Garage") + "\" style='width:100%;height:" + max_height + "px;' />");
                            getTitleImages();
                            $("#pictureCount").html(titleImages.images.length + " Items");
                            $("#pictureManager").html(buildTitlePicturePage());
                        }
                        else if (pageName == "newsManagement.php") {
                            $("#header").show();
                            $("#header").html("<img id=\"headerImage\" src=\"images/" + getTitlePictureForScreen("My Garage") + "\" style='width:100%;height:" + max_height + "px;' />");
                            $.ajax(
                            {
                                type: "GET",
                                url: "getNews.php",
                                success: function (data) {
                                    news = eval("(" + data + ")");
                                    $("#newsCount").html(getNewsCount() + " Items");
                                    $("#newsFullScreenContent").html(buildFullScreenNews());
                                    $("#newsMobileContent").html(buildMobileNews());
                                    $("#newsManager").html(buildNewsManager());
                                    $('#tblNewsManager').DataTable({ 'searching': false, 'lengthChange': false });

                                    //msg("getNews: " + data);
                                },
                                error: function (j, err) {
                                    showSystemMessageModal("error getting News: " + j.status);
                                }
                            });
                        }
                        else {
                            $("#header").show();
                            $("#header").html("<img id=\"headerImage\" src=\"images/2018JaguarF.jpg\" width=\"100%\" />");
                        }
                        $("#placeHolder").slideDown();
                    },
                    error: function (j, err) {
                        showSystemMessageModal("error getting " + pageName + ": " + j.status);
                    }
                });
            });
        });
    }
}
function closeSavePartToProjectModal() {
    PartHolding = "";
    $("#savePartToProjectModal").modal("hide");
}
function closeSavePhotoToProjectModal() {
    PhotoHolding = "";
    $("#savePhotoToProjectModal").modal("hide");
}
function showSavePartToProjectModal(path) {
    PartHolding = path;
    $("#savePartToProjectModal").modal("show");
    $("#imgSavePartToProject").html("<img src='" + path + "' style='width:" + window.innerWidth * .3 + "px;' />");
    $("#btnPartToProjectSave").addClass("disabled");
    getUserProjectsWithoutPart(user.user.id);
}
function showSavePhotoToProjectModal(path) {
    PhotoHolding = path;
    $("#savePhotoToProjectModal").modal("show");
    $("#imgSavePhotoToProject").html("<img src='" + path + "' style='width:" + window.innerWidth * .3 + "px;' />");
    $("#btnPhotoToProjectSave").addClass("disabled");
    getUserProjectsWithoutPhoto(user.user.id);
}
function getUserProjectsWithoutPart(TMUserID) {
    //msg(TMUserID);
    $.ajax({
        type: "GET",
        url: "getUserProjectsWithoutPart.php?TMUserID=" + TMUserID + "&partPath=" + PartHolding.substring(16,1000),
        success: function (data) {
            //msg("getUserProjects: " + data);
            projects = eval(data);
            createProjectBoxes();
            html = "";
            for (var i = 0; i < projects.projects.length; i++) {
                if (projects.projects[i].id != project.project.id) {
                    html += "<label><input type='radio' id='optPartProject' name='optProject' ";
                    html += "onclick='enablePartToProjectSaveBtn(\"" + projects.projects[i].id + "\");'";
                    html += " value='" + projects.projects[i].id + "'> ";
                    html += projects.projects[i].name;
                    html += "</label><br>";
                }
            }
            $("#savePartToProjectProjectList").html(html);

            //msg("user projects: " + projects.projects.length);
        },
        error: function (j, err) {
            msg("error getting user projects: " + j.status);
        }
    }).fail(function () {
        msg("AJAX Call failed to get user projects");
    });
}
function getUserProjectsWithoutPhoto(TMUserID) {
    //msg(TMUserID);
    $.ajax({
        type: "GET",
        url: "getUserProjectsWithoutPhoto.php?TMUserID=" + TMUserID + "&photoPath=" + PhotoHolding.substring(16, 1000),
        success: function (data) {
            projects = eval(data);
            //msg("getUserProjects: " + data);
            //createProjectBoxes();
            html = "";
            for (var i = 0; i < projects.projects.length; i++) {
                if (projects.projects[i].id != project.project.id) {
                    html += "<label><input type='radio' id='optPhotoProject' name='optProject' ";
                    html += "onclick='enablePhotoToProjectSaveBtn(\"" + projects.projects[i].id + "\");'";
                    html += " value='" + projects.projects[i].id + "'> ";
                    html += projects.projects[i].name;
                    html += "</label><br>";
                }
            }
            $("#savePhotoToProjectProjectList").html(html);

            //msg("user projects: " + projects.projects.length);
        },
        error: function (j, err) {
            msg("error getting user projects: " + j.status);
        }
    }).fail(function () {
        msg("AJAX Call failed to get user projects");
    });
}
function showPartLinkModal(path) {
    t = path.split("/");
    u = t[2].split(".");
    $("#imagePartPathDialog").modal("show");
    $("#txtPartImagePath").val(compileLink("?ProjectPic=" + u[0] + "&p=" + projectID));
    setTimeout(function () { $("#txtPartImagePath").focus(); }, 500);
}
function showPictureLinkModal(path) {
    t = path.split("/");
    u = t[2].split(".");
    $("#imagePicturePathDialog").modal("show");
    $("#txtPictureImagePath").val(compileLink("?ProjectPic=" + u[0] + "&p=" + projectID));
    setTimeout(function () { $("#txtPictureImagePath").focus(); }, 500);
    
}
function compileLink(hashtag) {
    path = window.location.host + "/" + window.location.pathname + hashtag;
    path = window.location.protocol + "//" + path.replace("//", "/");
    return path
}
function validateProjectForm() {
    var validationCounter = 0;
    $("#projectName").html("<h3>" + $("#myProjectName").val() + "</h3>");
    validationCounter += validatePrjectFormHelper("Name");
    validationCounter += validatePrjectFormHelper("Description");
    validationCounter += validatePrjectFormHelper("Make");
    validationCounter += validatePrjectFormHelper("Model");
    if (validationCounter < 4)
        $("#btnMyProjectSave").addClass("disabled");
    else
        $("#btnMyProjectSave").removeClass("disabled");
}
function validatePrjectFormHelper(field) {
    if ($("#myProject" + field).val() == "") {
        $("#myProject" + field + "Group").addClass("has-error");
        $("#myProject" + field + "Group").removeClass("has-success");
        $("#myProject" + field + "GroupSpan").addClass("glyphicon-remove");
        $("#myProject" + field + "GroupSpan").removeClass("glyphicon-ok");
        return 0;
    }
    else {
        $("#myProject" + field + "Group").removeClass("has-error");
        $("#myProject" + field + "Group").addClass("has-success");
        $("#myProject" + field + "GroupSpan").removeClass("glyphicon-remove");
        $("#myProject" + field + "GroupSpan").addClass("glyphicon-ok");
        return 1;
    }
}
function showProject(projID) {
    projectID = projID;
    $("#savePartToProjectModal").modal("hide");
    $("#savePhotoToProjectModal").modal("hide");
    showPage('myProject.php', 'myGarageMenu');
}
function showNewProject(projID, fullPath) {
    pFullPath = fullPath;
    projectID = projID;
    showPage('myNewProject.php', 'myGarageMenu');
}
function showNewPart(projID, fullPath) {
    pFullPath = fullPath;
    projectID = projID;
    showPage('myNewPart.php', 'myGarageMenu');
}
function calculateImageSizes() {
    span = .66;
    if (window.innerWidth < 1042)
        span = 1;
    max_width = window.innerWidth * span * .8;
    for (var i = project.images.length - 1; i > -1; i--) {
        if (project.images[i].active == "0") {
            project.images.splice(i, 1);
        }
    }
    tallest = 0;
    for (var i = 0; i < project.images.length; i++) {
        imgWidth = project.images[i].width;
        imgHeight = project.images[i].height;
        targetWidth = imgWidth;
        targetHeight = imgHeight;
        if (imgHeight > max_height) {
            targetHeight = max_height;
            targetWidth = (max_height / imgHeight) * imgWidth;
        }
        if (targetWidth > max_width) {
            targetWidth = max_width;
            targetHeight = (max_width / imgWidth) * imgHeight;
        }
        if ($("#divMyNewProjectPicContainer").innerHeight() > $("#divMyNewProjectDescription").innerHeight())
            tTop = ($("#divMyNewProjectPicContainer").innerHeight() - targetHeight) / 2;
        else
            tTop = ($("#divMyNewProjectDescription").innerHeight() - targetHeight) / 2;
        if (tTop < 0)
            tTop = 0;
        cLeft = ((max_width - targetWidth) / 2) + (window.innerWidth * span * .1);
        project.images[i].targetHeight = targetHeight;
        project.images[i].targetWidth = targetWidth;
        project.images[i].targetTop = tTop;
        project.images[i].targetLeft = cLeft;
        if (targetHeight > tallest) {
            tallest = targetHeight;
        }
    }
    if (tallest < 159)
        tallest = 159;
    project.project.tallest = tallest;
    for (var i = 0; i < project.images.length; i++) {
        project.images[i].targetTop = (project.project.tallest - project.images[i].targetHeight) / 2;
    }
}
function calculatePartSizes() {
    span = .66;
    if (window.innerWidth < 1042)
        span = 1;
    max_width = window.innerWidth * span * .8;
    for (var i = project.parts.length - 1; i > -1; i--) {
        if (project.parts[i].active == "0") {
            project.parts.splice(i, 1);
        }
    }
    tallest = 0;
    for (var i = 0; i < project.parts.length; i++) {
        imgWidth = project.parts[i].width;
        imgHeight = project.parts[i].height;
        targetWidth = imgWidth;
        targetHeight = imgHeight;
        if (imgHeight > max_height) {
            targetHeight = max_height;
            targetWidth = (max_height / imgHeight) * imgWidth;
        }
        if (targetWidth > max_width) {
            targetWidth = max_width;
            targetHeight = (max_width / imgWidth) * imgHeight;
        }
        if ($("#divMyNewProjectPicContainer").innerHeight() > $("#divMyNewProjectDescription").innerHeight())
            tTop = ($("#divMyNewProjectPicContainer").innerHeight() - targetHeight) / 2;
        else
            tTop = ($("#divMyNewProjectDescription").innerHeight() - targetHeight) / 2;
        if (tTop < 0)
            tTop = 0;
        cLeft = ((max_width - targetWidth) / 2) + (window.innerWidth * span * .1);
        project.parts[i].targetHeight = targetHeight;
        project.parts[i].targetWidth = targetWidth;
        project.parts[i].targetTop = tTop;
        project.parts[i].targetLeft = cLeft;
        if (targetHeight > tallest) {
            tallest = targetHeight;
        }
    }
    if (tallest < 159)
        tallest = 159;
    project.project.tallest = tallest;
    for (var i = 0; i < project.parts.length; i++) {
        project.parts[i].targetTop = (project.project.tallest - project.parts[i].targetHeight) / 2;
    }
}
function showNewPartImages(fullPath) {
    imgElem = -1;
    for (var i = 0; i < project.parts.length; i++) {
        if (fullPath == project.parts[i].fullpath)
            imgElem = i;
    }
    $("#divMyNewProjectTargetPic").html(getMyProjectPartHref(imgElem));
    $("#divMyNewProjectPicContainer").height(project.project.tallest);
    $("#divMyNewProjectDescription").attr("style", "min-height:" + project.project.tallest);
    $("#myProjectPartVendorRef").html("<a href='" + project.parts[imgElem].vendorlink + "' target='_empty' class='btn btn-danger btn-block'>View on Vendor's Site</a>");
    $("#MyNewProjectDescription").html(decode(project.parts[imgElem].description));
    $("#btnSharePartImageLink").attr("onclick", "showPartLinkModal('" + fullPath + "');");
    $("#btnSavePartToProject").attr("onclick", "showSavePartToProjectModal('" + fullPath + "');");
}
function showNewProjectImages(fullPath) {
    debug = 0;
    $("#imgMyNewProjectLeftPic").show();
    $("#imgMyNewProjectRightPic").show();
    s = "";
    imgElem = -1;
    for (var i = 0; i < project.images.length; i++) {
        if (fullPath == project.images[i].fullpath)
            imgElem = i;
    }
    $("#MyNewProjectDescription").html(decode(project.project.description));
    //msg(s);

    $("#divMyNewProjectTargetPic").html(getMyProjectImageHref(imgElem, "Center"));
    targetStyle = "left:" + project.images[imgElem].targetLeft + "px;";
    targetStyle += "width:" + project.images[imgElem].targetWidth + "px;";
    targetStyle += "top:" + project.images[imgElem].targetTop + "px;";
    targetStyle += "height:" + project.images[imgElem].targetHeight + "px;"
    $("#imgMyNewProjectTargetPic").attr("src", project.images[imgElem].fullpath);
    $("#imgMyNewProjectTargetPic").attr("style", targetStyle);
    $("#divMyNewProjectPicContainer").height(project.project.tallest);
    $("#btnSharePictureImageLink").attr("onclick", "showPictureLinkModal('" + fullPath + "');");
    $("#btnSavePhotoToProject").attr("onclick", "showSavePhotoToProjectModal('" + fullPath + "');");
    if (project.images.length == 1) {
        $("#imgMyNewProjectLeftPic").hide();
        $("#imgMyNewProjectRightPic").hide();
    }
    else {
        if (project.images.length == 2) {
            $("#imgMyNewProjectRightPic").hide();
            pic2 = 0;
            if (project.images[0].fullpath == fullPath) {
                pic2 = 1;
            }
            $("#divMyNewProjectLeftPic").html(getMyProjectImageHref(pic2, "Left"));
        }
        else {
            for (var i = 0; i < project.images.length; i++) {
                if ("images/projects/" + project.images[i].filename == fullPath) {
                    if (i == project.images.length - 1) {
                        $("#divMyNewProjectLeftPic").html(getMyProjectImageHref(i - 1, "Left"));
                        $("#divMyNewProjectRightPic").html(getMyProjectImageHref(0, "Right"));
                    }
                    else {
                        if (i == 0) {
                            $("#divMyNewProjectLeftPic").html(getMyProjectImageHref(project.images.length - 1, "Left"));
                            $("#divMyNewProjectRightPic").html(getMyProjectImageHref(1, "Right"));
                        }
                        else {
                            $("#divMyNewProjectLeftPic").html(getMyProjectImageHref(i - 1, "Left"));
                            $("#divMyNewProjectRightPic").html(getMyProjectImageHref(i + 1, "Right"));
                        }
                    }
                }
            }
        }
    }
}
function getMyProjectPartHref(i) {
    adjWidth = project.parts[i].targetWidth;
    adjHeight = project.parts[i].targetHeight;
    adjTop = project.parts[i].targetTop;
    span = .66;
    if (window.innerWidth < 1042)
        span = 1;
    hpos = "left:" + (((window.innerWidth * span) - adjWidth) / 2) + "px;"
    ctl = "imgMyNewProjectTargetPic";
    targetStyle = hpos + "width:" + adjWidth + "px;";
    targetStyle += "top:" + adjTop + "px;";
    targetStyle += "height:" + adjHeight + "px;"
    html = "<a href='javascript:void(0);' >";
    html += "<img id='" + ctl + "' src='" + project.parts[i].fullpath + "' style='" + targetStyle + "' /></a>";
    return html;
}
function getMyProjectImageHref(i, img) {
    adjWidth = project.images[i].targetWidth;
    adjHeight = project.images[i].targetHeight;
    adjTop = project.images[i].targetTop;
    if ((project.project.tallest * .6) < adjHeight) {
        adjHeight *= .6;
        adjWidth *= .6;
        adjTop = (project.project.tallest - adjHeight) / 2;
    }
    span = .66;
    if (window.innerWidth < 1042)
        span = 1;
    hpos = "left:" + ((window.innerWidth * span) - adjWidth) + "px;"
    ctl = "imgMyNewProjectRightPic";
    if (img == "Left") {
        hpos = "left:0px;"
        ctl = "imgMyNewProjectLeftPic";
    }
    targetStyle = hpos + "width:" + adjWidth + "px;";
    targetStyle += "top:" + adjTop + "px;";
    targetStyle += "height:" + adjHeight + "px;"
    html = "<a href='javascript:void(0);' onclick='showNewProjectImages(\"" + project.images[i].fullpath + "\");'>";
    if (img == "Center") {
        ctl = "imgMyNewProjectTargetPic";
        html = "<a href='javascript:void(0);' onclick='showNewProjectImagesFullScreen";
        html += "(\"" + project.images[i].fullpath + "\");'>";
    }
    html += "<img id='" + ctl + "' src='" + project.images[i].fullpath + "' style='" + targetStyle + "' /></a>";
    return html;
}
function hideNewProjectImagesFullScreen() {
    $("#titlebar").show();
    $("#placeHolder").show();
    $("#copyright").show();
    $("#divProjectImagesFullScreenImage").hide();
    $("#divProjectImagesFullScreenButtonBar").hide();
}
function showNewProjectImagesFullScreen(path) {
    bb = "";
    bbwidth = 0;
    for (var j = 0; j < project.images.length; j++) {
        if (project.images[j].fullpath == path) {
            i = j;
        }
        else {
            bb += "<a href='javascript:void(0);' onclick='showNewProjectImagesFullScreen(\"";
            bb += project.images[j].fullpath + "\");'><img src='";
            bb += project.images[j].fullpath + "' style='height:50px' /></a>"
            bbwidth += (50 / project.images[j].height) * project.images[j].width;
        }
    }
    bb += "<a href='javascript:void(0);' onclick='hideNewProjectImagesFullScreen();'><img src='";
    bb += "images/circlecrosssmall.jpg' style='height:50px' /></a>"
    $("#divProjectImagesFullScreenButtonBar").html(bb);
    imgWidth = project.images[i].width;
    imgHeight = project.images[i].height;
    targetWidth = imgWidth;
    targetHeight = imgHeight;
    ctop = 0;
    cleft = 0;
    if (imgHeight > window.innerHeight) {
        targetHeight = window.innerHeight;
        targetWidth = (window.innerHeight / imgHeight) * imgWidth;
    }
    if (targetWidth > window.innerWidth) {
        targetWidth = window.innerWidth;
        targetHeight = (window.innerWidth / imgWidth) * imgHeight;
    }
    if (targetWidth < window.innerWidth)
        cleft = (window.innerWidth - targetWidth) / 2;
    if (targetHeight < window.innerWidth)
        ctop = (window.innerHeight - targetHeight) / 2;
    html = "";
    html += "<a href='javascript:void(0);' onclick='hideNewProjectImagesFullScreen();'>";
    html += "<img src='" + path + "' style='position:absolute;top:" + ctop + "px;left:" + cleft + "px;";
    html += "height:" + targetHeight + "px;width:" + targetWidth + "px;' />";
    html += "</a>";
    //$("#imgMyNewProjectTargetPic").attr("style", "height:" + window.innerHeight + "px;width:" + window.innerWidth + "px;");
    $("#titlebar").hide();
    $("#placeHolder").hide();
    $("#copyright").hide();
    $("#divProjectImagesFullScreenImage").show();
    $("#divProjectImagesFullScreenButtonBar").show();
    $("#divProjectImagesFullScreenImage").html(html);
    setTimeout(function () {
        cleft = (window.innerWidth - bbwidth) / 2
        bb = "position:absolute;top:0px;left:" + cleft + "px;";
        $("#divProjectImagesFullScreenButtonBar").attr("style", bb);
    }, 0)
    //    $('#newProjectImagesFullScreenModal').modal('show');
    //calculate what full screen means for this image
    //display in full screen
    //create info bar to navigate to other pics
}
function createProjectBoxes() {
    html = "";
    //msg(JSON.stringify(projects));
    html += "<a href='#Project' onclick='showProject(\"-1\");' style='text-decoration:none;color:black;'>";
    html += "<div class='projectBox' style='background:url(images/circleplussmall.png) no-repeat center center'>";
    html += "<h4>Add Project</h4>";
    html += "</div></a>";
    for (var i = 0; i < projects.projects.length; i++) {
        if (projects.projects[i].active == "1") {
            html += "<a href='#Project' onclick='showProject(" + projects.projects[i].id
            html += ");' style='text-decoration:none;color:black;'>";
            html += "<div class='projectBox'>";
            html += "<h4>" + decode(projects.projects[i].name) + "</h4>";
            if (projects.projects[i].leadimage == "") {
                if (projects.projects[i].firstimage > "") {
                    html += "<img src='images/projects/" + projects.projects[i].firstimage + "'";
                    html += " style='display:block;width:100%;margin:auto;' />";
                }
            }
            else{
                html += "<img src='images/projects/" + projects.projects[i].leadimage + "'";
                html += " style='display:block;width:100%;margin:auto;' />";
            }
            html += "</div></a>";
        }
    }
    $("#projectBoxes").html(html);
}
function saveForum(id, parentObject, parentID, TMUserID, active, title, projectid, message, button) {
    $("#showForumEditor").modal("hide");
    //msg("id: " + id + "\nPO: " + parentObject + "\nPI: " + parentID + "\nTMU: " + TMUserID + "\nactive: " + active + "\ntitle: " + title + "\nmessage: " + message + "\nprojectID: " + projectid);
    //data: { adTextArea: tinymce.activeEditor.getContent() },
    if (button == "11") {
        for (var i = 0; i < forum.forum.length; i++) {
            if (forum.forum[i].id == id) {
                title = forum.forum[i].title;
                message = forum.forum[i].message;
                i = forum.forum.length;
            }
        }
    }
    for (var i = 0; i < forum.forum.length; i++) {
        if (forum.forum[i].id == parentID) {
            forum.forum[i].expanded = "1";
        }
    }
    orig_forum = forum;
    $.ajax(
    {
        type: "POST",
        url: "updateForum.php",
        async: false,
        data: { id: id, parentObject: parentObject, projectid: projectid, parentID: parentID, TMUserID: TMUserID, active: active, title: title, message: message },
        success: function (data) {
            //msg("updateForum: " + title + " - " + data);
            $.ajax(
            {
                type: "GET",
                url: "getForum.php?ParentObject=" + parentObject + "&projectID=" + projectid,
                success: function (data) {
                    forum = eval("(" + data + ")");
                    for (var i = 0; i < forum.forum.length; i++) {
                        for (var j = 0; j < orig_forum.forum.length; j++) {
                            if (forum.forum[i].id == orig_forum.forum[j].id)
                                forum.forum[i].expanded = orig_forum.forum[j].expanded;
                        }
                    }
                    //msg(forum.forum.length);
                    //msg(forum.forum[0].subForums.length);
                    html = "<table border='0' width='100%'><tr><td>";
                    html += buildForumTable(forum, 0, "0", "forum");
                    html += "</td></tr></table>";
                    //msg("html: " + html);
                    if (projectid == "-1")
                        $("#forumFullScreenContent").html(html);
                    else
                        $("#projectForum").html(html);
                    //$("#forumCount").html(users.users.length + " Items");
                    //$("#userFullScreenContent").html(buildFullScreenUsers());
                    ////$("#userMobileContent").html(buildMobileUsers());
                    //$('#tblFullScreenUsers').DataTable({ 'searching': false, 'lengthChange': false });

                    //msg("getNews: " + data);
                },
                error: function (j, err) {
                    showSystemMessageModal("error getting forum: " + j.status);
                }
            });
        },
        error: function (j, err) {
            showSystemMessageModal("error updating forum " + j.status);
        }
    });
}
function openForumModal(parentObject, parentID, TMUserID, active, id, projectID) {
    title = "";
    message = "";
    for (var i = 0; i < forum.forum.length; i++) {
        if (forum.forum[i].id == id) {
            title = decodeURI(forum.forum[i].title);
            message = decodeURI(forum.forum[i].message);
            i = forum.forum.length;
        }
    }
    $("#editForumMessage").summernote('code', decode(message));
    $("#editForumTitle").val(decode(title));
    if (location.toString().indexOf("#Forum") > 0)
        $("#forumEditorTitle").html("<h3>Forum Editor</h3>");
    else
        $("#forumEditorTitle").html("<h3>Comments</h3>");
    $("#showForumEditor").modal("show");
    //https://summernote.org/getting-started/#installation
    //$('#editForumMessage').summernote("destroy");
    //$('#editForumMessage').summernote({ height: 300 });
    $("#editParentObject").val(parentObject);
    if (parentID == "")
        parentID = "0";
    $("#editParentID").val(parentID);
    $("#editForumProjectID").val(projectID);
    $("#editTMUserID").val(TMUserID);
    $("#editForumID").val(id);
    $("#editForumActive").val(active);
}
function expand(i) {
    if (forum.forum[i].expanded == "0")
        forum.forum[i].expanded = "1";
    else
        forum.forum[i].expanded = "0";
    html = "<table border='0' width='100%'><tr><td>";
    html += buildForumTable(forum, 0, "0", "forum");
    html += "</td></tr></table>";
    if (forum.forum[i].projectID == "-1")
        $("#forumFullScreenContent").html(html);
    else
        $("#projectForum").html(html);
}
function buildForumTable(forum, indent, parentID, source) {
    //if (source == "forum") {
        if (user.user.level == "admin") {
            $("#addNewThread").html("<button class='btn btn-primary' onclick=\"openForumModal('Forum', '0', '" + user.user.id + "', '1', '0', '-1')\">Create New Thread</button>");
        }
    //}
    //if (source == "project") {
    //    $("#addNewProjectThread").html("<button class='btn btn-primary' onclick=\"openForumModal('Forum', '', '" + user.user.id + "', '1', '', '', '0')\">Create New Thread</button>");
    //}
    $("#forumCount").html(forum.forum.length + " Items");
    if (forum.forum.length == 0)
        html = "Be the first to comment on this project!";
    else
        html = "";
    for (var i = 0; i < forum.forum.length; i++) {
        //msg("forum.forum[i].parentID: " + forum.forum[i].parentID + " = parentID: " + parentID);
        if (forum.forum[i].parentID == parentID) {
            //msg("indent: " + indent + ", passed: " + forum.forum[i].id);
            html += "<table border='0' width='100%'>";
            html += "   <tr>";
            html += "       <td style='width:'" + indent + "%' align='right'>";
            if (indent > 0)
                html += "<img src='images/arrow.jpg' height='20px'>";
            html += "       </td>";
            html += "       <td width='" + (100 - indent) + "%'>";
            html += "           <div class='panel panel-default'>";
            html += "               <div class='panel-heading'>";
            html += "                   <div class='row'>";
            html += "                       <table width='100%' border=0><tr><td width=200px>&nbsp;&nbsp;";
            if (forum.forum[i].children != "0") {
                if (forum.forum[i].expanded == "0") {
                    html += "<a href='javascript:void(0);' onclick='expand(\"" + i + "\");'>";
                    html += "<img src='images/green_plus.png' width=25px>";
                    html += "</a>";
                }
                else {
                    html += "<a href='javascript:void(0);' onclick='expand(\"" +i + "\");'>";
                    html += "<img src='images/red_minus.png' width=25px>";
                    html += "</a>";
                }
            }
            if (forum.forum[i].imagePath == "")
                html += "                       <img src='images/noprofilepicture.jpg' width='50px'>";
            else
                html += "                       <img src='images/" + forum.forum[i].imagePath + "' width='50px'>";
            html += "                       <b>" + forum.forum[i].username;
            html += "                       </b></td><td><br /><b>" + decodeURI(forum.forum[i].title);
            html += "                       </b></td></tr></table>";
            html += "                   </div>";
            html += "               </div>";
            html += "               <div class='panel-body hidden-xs'>" + decodeURI(forum.forum[i].message);
            html += "               </div>";
            html += "               <div class='modal-footer'>";
            if (user.user.id == forum.forum[i].TMUserID) {
                html += "<button class='btn btn-primary' onclick='openForumModal(";
                html += "\"" + forum.forum[i].parentObject + "\", ";
                html += "\"" + forum.forum[i].parentID + "\", ";
                html += "\"" + forum.forum[i].TMUserID + "\", ";
                html += "\"" + forum.forum[i].active + "\", ";
                html += "\"" + forum.forum[i].id + "\", ";
                html += "\"" + forum.forum[i].projectID + "\")'>Edit</button>&nbsp;";
            }
            if (user.user.level == "admin") {
                html += "<button class='btn btn-danger' title='Admins can hide posts' onclick='saveForum(";
                html += "\"" + forum.forum[i].id + "\", ";
                html += "\"" + forum.forum[i].parentObject + "\", ";
                html += "\"" + forum.forum[i].parentID + "\", ";
                html += "\"" + user.user.id + "\", ";
                html += "\"0\", ";
                html += "\"" + forum.forum[i].title + "\", ";
                html += "\"" + forum.forum[i].projectID + "\", ";
                html += "\"" + forum.forum[i].message + "\", ";
                html += "\"1\");'>";
                html += "Hide</button>"
            }
            if (user.user.id != 0) {
                html += "                   <button class='btn btn-primary' onclick='openForumModal(";
                html += "\"" + forum.forum[i].parentObject + "\",";
                html += "\"" + forum.forum[i].id + "\",";
                html += "\"" + user.user.id + "\", ";
                html += "\"1\",";
                html += "\"0\",";
                html += "\"" + forum.forum[i].projectID + "\");'>Reply</button>";
            }
            html += "               </div>";
            html += "           </div>";
            html += "       </td>";
            html += "   </tr>";
            html += "</table>";
            if (forum.forum[i].expanded == "1")
                html += buildForumTable(forum, indent + 3, forum.forum[i].id, source);
        }
    }
    return html;
}
function getTitlePictureForScreen(screenName) {
    //set up defaults
    if (screenName == "Photos")
        imageName = "PhotoPageHeader1.jpg";
    if (screenName == "Parts & Tools")
        imageName = "2018JaguarF.jpg";
    if (screenName == "Find Local Pros")
        imageName = "2018JaguarF.jpg";
    if (screenName == "Courses")
        imageName = "2018JaguarF.jpg";
    if (screenName == "Forum")
        imageName = "2018JaguarF.jpg";
    if (screenName == "My Garage")
        imageName = "KitCar.jpg";
    //see if a title image has been set for this screen
    for (var i = 0; i < titleImages.images.length; i++) {
        if ((titleImages.images[i].location == screenName) && (titleImages.images[i].active == "1")) {
            imageName = titleImages.images[i].filename;
            i = titleImages.images.length;
        }
    }
    return imageName;
}
function showPicModal(filename, title) {
    $("#showPicModal").modal("show");
    $("#showPicTitle").html("<center><h3>" + title + "</h3></center>");
    $("#showPicPic").html("<img src='" + filename + "' width='100%'>");
}

function getTitleImages() {
    $.ajax(
        {
            type: "GET",
            url: "getTitleImages.php",
            success: function (data) {
                titleImages = eval("(" + data + ")");
                //showSystemMessageModal(titleImages.images.length);
                //msg(titleImages.images[0].filename);
            },
            error: function (j, err) {
                showSystemMessageModal("error getting home page images: " + j.status);
            }
        }
    );
}
function buildTitlePicturePage() {
    var html = "<table id='tblPictureManager' class='row-border' style='width:80%'>";
    html += "<thead><tr><th colspan='2'><center>Actions</center></th><th>Title</th><th>Image</th>";
    html += "<th>Screen Location</th></tr></thead><tbody>";
    for (var i = 0 ; i < titleImages.images.length ; i++) {
        html += "<tr height=40px><td width=60px><button onclick='openTitlePictureModal(" + titleImages.images[i].id + ");' ";
        html += "class='btn btn-primary'>Edit</button></td>";
        html += "<td width=80px><button ";
        html += "onclick='updateTitlePicture(\"" + titleImages.images[i].title + "\",\"";
        html += titleImages.images[i].filename + "\",\"";
        if (titleImages.images[i].active == "1") {
            html += titleImages.images[i].location + "\",\"0\",\"" + titleImages.images[i].id + "\");'";
            html += " class='btn btn-danger'>Disable</button></td><td>";
        }
        else {
            html += titleImages.images[i].location + "\",\"1\",\"" + titleImages.images[i].id + "\");'";
            html += " class='btn btn-success'>Enable</button></td><td>";
        }
        html += titleImages.images[i].title + "</td><td>";
        html += "<img src=\"images/" + titleImages.images[i].filename + "\" height=\"50px\" />";
        html += "</td><td>" + titleImages.images[i].location + "</td></tr>";
    }
    html += "<tr height=40px><td colspan=2><center><button onclick='openTitlePictureModal(0);' ";
    html += "class='btn btn-primary'>Add New</button></center></td><td>&nbsp;</td></tr></tbody></table>";
    return html;
}
function uploadTitlePicture() {
    $("#titlePictureModal").modal("hide");
    var data = new FormData($('#frmTitlePictureUpload')[0]);

    $.ajax({
        url: 'uploadTitlePicture.php',
        type: 'POST',
        data: data,
        cache: false,
        processData: false,
        contentType: false,
        success: function (data) {
            //msg("upload file: " + data);
            $.ajax(
                {
                    type: "GET",
                    url: "getTitleImages.php",
                    success: function (data) {
                        //msg(data);
                        titleImages = eval("(" + data + ")");
                        $("#pictureManager").html(buildTitlePicturePage());
                    },
                    error: function (j, err) {
                        showSystemMessageModal("error getting home page images: " + j.status);
                    }
                }
            );
        },
        error: function (j, err) {
            msg("error uploading title page image: " + j.status);
        }
    }).fail(function () {
        $("#uploadStatus").html("AJAX Call failed to upload title page image.").show().fadeOut(5000);
    });
}
function updateTitlePicture(title, filename, location, active, id) {
    $("#titlePictureModal").modal("hide");
    error = false;
    cnt = 0;
    for (var i = 0; i < titleImages.images.length; i++) {
        if ((titleImages.images[i].location == "Home") && (titleImages.images[i].active == "1"))
            cnt += 1;
    }
    for (var i = 0; i < titleImages.images.length; i++) {
        if (titleImages.images[i].filename == filename)
            if ((titleImages.images[i].location == "Home") && (!(location == "Home")) && (cnt == 1))
                error = true;
    }
    if ((location == "Home") && (active == "0") & (error == false)) {
        cnt = 0;
        for (var i = 0; i < titleImages.images.length; i++) {
            if ((titleImages.images[i].location == "Home") && (titleImages.images[i].active == "1"))
                cnt += 1;
        }
        if (cnt == 1)
            error = true;
    }
    if (error)
        showSystemMessageModal("At lease one Home image should be enabled\nfor the carousel to work.");
    else {
        $.ajax(
        {
            type: "POST",
            url: "updateTitlePicture.php",
            async: false,
            data: { title: title, location: location, active: active, id: id },
            success: function (data) {
                //msg(data);
                $.ajax(
                    {
                        type: "GET",
                        url: "getTitleImages.php",
                        success: function (data) {
                            //msg(data);
                            titleImages = eval("(" + data + ")");
                            $("#pictureManager").html(buildTitlePicturePage());
                        },
                        error: function (j, err) {
                            showSystemMessageModal("error getting home page images: " + j.status);
                        }
                    }
                );
            },
            error: function (j, err) {
                showSystemMessageModal("error updating title pictures " + j.status);
            }
        });
    }
}
function openTitlePictureModal(id) {
    $("#titlePictureModal").modal("show");
    if (id == 0) {
        $("#titlePictureID").val("0");
        $("#titlePictureTitle").val("");
        $("#titlePictureFilename").val("");
        $("#titlePictureLocation").val("Home");
        $("#titlePictureActive").val("1");
        $("#titlePictureUpload").show();
        $("#updateTitlePictureButton").hide();
        $("#addTitlePictureButton").show();
    }
    else {
        for (var i = 0 ; i < titleImages.images.length ; i++) {
            if (titleImages.images[i].id == id) {
                $("#titlePictureID").val(titleImages.images[i].id);
                $("#titlePictureTitle").val(decode(titleImages.images[i].title));
                $("#titlePicture").attr("src", "images/" + titleImages.images[i].filename);
                $("#titlePictureFilename").val(titleImages.images[i].filename);
                $("#titlePictureUpload").hide();
                $("#titlePictureLocation").val(titleImages.images[i].location);
                $("#titlePictureActive").val(titleImages.images[i].active);
                $("#updateTitlePictureButton").show();
                $("#addTitlePictureButton").hide();
            }
        }
    }
}
function buildHomePagePanoramic() {
    //    msg(homePageImages.images.length);
    //BootStrap Carousel https://www.w3schools.com/bootstrap/bootstrap_ref_js_carousel.asp
    html = "<div id=\"Panoramic\" class=\"\" style=\"background-color:#f5f5f5\">";
    html += "<div id=\"myCarousel\" class=\"carousel slide carousel-fade col-lg-12 col-md-12 col-sm-12 col-xs-12\" ";
    html += "data-ride=\"carousel\">";
    // Indicators 
    html += "<ol class=\"carousel-indicators\">";
    activeTaken = false;
    for (var i = 0; i < titleImages.images.length; i++) {
        if ((titleImages.images[i].location == "Home") && (titleImages.images[i].active == "1")){
            html += "<li data-target=\"#myCarousel\" data-slide-to=\"" + i + "\"";
            if (!(activeTaken)) {
                html += " class=\"active\"";
                activeTaken = true;
            }
            html += "></li>";
        }
    }
    html += "</ol>";
    // Wrapper for slides 
    html += "<div class=\"carousel-inner\" role=\"listbox\">";
    activeTaken = false;
    for (var i = 0; i < titleImages.images.length; i++) {
        if ((titleImages.images[i].location == "Home") && (titleImages.images[i].active == "1")) {
            html += "<div style='height:" + max_height + "px' class=\"item";
            if (!(activeTaken)) {
                html += " active";
                activeTaken = true;
            }
            html += "\"><img src='images/" + titleImages.images[i].filename + "' style='width:100%;height:" + max_height + "px;' />";
            html += "<div class=\"carousel-caption\"><h4>" + titleImages.images[i].title + "</h4></div>";
            html += "</div>";
        }
    }
    html += "</div>";
    //showSystemMessageModal(html);
    //Left and right controls
    html += "<a class=\"left carousel-control\" href=\"#myCarousel\" data-slide=\"prev\">";
    html += "<span class=\"glyphicon glyphicon-chevron-left\"></span>";
    html += "<span class=\"sr-only\">Previous</span>";
    html += "</a>";
    html += "<a class=\"right carousel-control\" href=\"#myCarousel\" data-slide=\"next\">";
    html += "<span class=\"glyphicon glyphicon-chevron-right\"></span>";
    html += "<span class=\"sr-only\">Next</span>";
    html += "</a>";
    html += "</div>";
    html += "</div>";
    return html;
}

function buildPartsPage() {
    html = "<div><div class='row'>";
    //msg(window.innerWidth);
    if (window.innerWidth > 500)
        html += "<div class='col-lg-1 col-md-1 col-sm-1 hidden-xs'></div>";
    for (var i = 0 ; i < stockParts.parts.length ; i++) {
        if (window.innerWidth > 1023)
            html += "<div class='col-lg-3 col-md-3 col-sm-3 col-xs-3'>";
        else
            if (window.innerWidth > 500)
                html += "<div class='col-lg-5 col-md-5 col-sm-5 col-xs-5'>";
            else
                html += "<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12'>";
        html += "<span class='photoPagePics'>";
        if (stockParts.parts[i].projectID == "") {
            html += "<a href=\"javascript:void(0);\" onclick=\"showPicModal('";
            html += stockParts.parts[i].fullpath + "', '";
            if (stockParts.parts[i].title == "")
                html += "');\">";
            else
                html += stockParts.parts[i].title + "');\">";
            html += "<img src=\"" + stockParts.parts[i].fullpath;
            if (stockParts.parts[i].title == "")
                html += "\" title=\"";
            else
                html += "\" title=\"" + stockParts.parts[i].title;
        }
        else {
            html += "<a href=\"javascript:void(0);\" onclick=\"showNewPart('";
            html += stockParts.parts[i].projectID + "', '" + stockParts.parts[i].fullpath + "');\">";
            html += "<img src=\"" + stockParts.parts[i].fullpath;
            if (stockParts.parts[i].title == "")
                html += "\" title=\"";
            else
                html += "\" title=\"" + stockParts.parts[i].title;
        }
        html += "\" height=\"150px\" /></a></span></div>";
        if (window.innerWidth > 1023) {
            if (((i + 1) % 3) == 0) {
                html += "</div><div class='row'><div class='col-lg-12 col-md-12 col-sm-12 col-xs-12' ";
                html += "style='height:20px'></div></div><div class='row'>";
                html += "<div class='col-lg-1 col-md-1 col-sm-1 hidden-xs'></div>";
            }
        }
        else
            if (window.innerWidth > 500) {
                if (((i + 1) % 2) == 0) {
                    html += "</div><div class='row'><div class='col-lg-12 col-md-12 col-sm-12 col-xs-12' ";
                    html += "style='height:20px'></div></div><div class='row'>";
                    html += "<div class='col-lg-1 col-md-1 col-sm-1 hidden-xs'></div>";
                }
                else
                    html += "<div class='col-lg-1 col-md-1 col-sm-1 col-xs-1' style='width:20px'></div>";
            }
            else {
                html += "</div><div class='row'><div class='col-lg-12 col-md-12 col-sm-12 col-xs-12' ";
                html += "style='height:20px'></div></div><div class='row'>";
                html += "<div class='col-lg-1 col-md-1 hidden-sm hidden-xs'></div>";
            }
    }
    html += "</div>";
    $("#partsResults1").html(stockParts.parts.length + " Items");
    $("#partsResults2").html(stockParts.parts.length + " Items");

    return html;
}
function buildPhotosPage() {
    html = "<div><div class='row'>";
    //msg(window.innerWidth);
    if (window.innerWidth > 500)
        html += "<div class='col-lg-1 col-md-1 col-sm-1 hidden-xs'></div>";
    for (var i = 0 ; i < stockImages.images.length ; i++) {
        if (window.innerWidth > 1023)
            html += "<div class='col-lg-3 col-md-3 col-sm-3 col-xs-3'>";
        else
            if (window.innerWidth > 500)
                html += "<div class='col-lg-5 col-md-5 col-sm-5 col-xs-5'>";
            else
                html += "<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12'>";
        html += "<span class='photoPagePics'>";
        if (stockImages.images[i].projectID == "") {
            html += "<a href=\"#Photos\" onclick=\"showPicModal('";
            html += stockImages.images[i].fullpath + "', '";
            if (stockImages.images[i].title == "")
                html += "');\">";
            else
                html += stockImages.images[i].title + "');\">";
            html += "<img src=\"" + stockImages.images[i].fullpath;
            if (stockImages.images[i].title == "")
                html += "\" title=\"";
            else
                html += "\" title=\"" + stockImages.images[i].title;
        }
        else {
            html += "<a href=\"javascript:void(0);\" onclick=\"showNewProject('";
            html += stockImages.images[i].projectID + "', '" + stockImages.images[i].fullpath + "');\">";
            html += "<img src=\"" + stockImages.images[i].fullpath;
            if (stockImages.images[i].title == "")
                html += "\" title=\"";
            else
                html += "\" title=\"" + stockImages.images[i].title;
        }
        html += "\" height=\"150px\" /></a></span></div>";
        if (window.innerWidth > 1023) {
            if (((i + 1) % 3) == 0) {
                html += "</div><div class='row'><div class='col-lg-12 col-md-12 col-sm-12 col-xs-12' ";
                html += "style='height:20px'></div></div><div class='row'>";
                html += "<div class='col-lg-1 col-md-1 col-sm-1 hidden-xs'></div>";
            }
        }
        else
            if (window.innerWidth > 500) {
                if (((i + 1) % 2) == 0) {
                    html += "</div><div class='row'><div class='col-lg-12 col-md-12 col-sm-12 col-xs-12' ";
                    html += "style='height:20px'></div></div><div class='row'>";
                    html += "<div class='col-lg-1 col-md-1 col-sm-1 hidden-xs'></div>";
                }
                else
                    html += "<div class='col-lg-1 col-md-1 col-sm-1 col-xs-1' style='width:20px'></div>";
            }
            else {
                html += "</div><div class='row'><div class='col-lg-12 col-md-12 col-sm-12 col-xs-12' ";
                html += "style='height:20px'></div></div><div class='row'>";
                html += "<div class='col-lg-1 col-md-1 hidden-sm hidden-xs'></div>";
            }
    }
    html += "</div>";
    $("#stockImageResults1").html(stockImages.images.length + " Items");
    $("#stockImageResults2").html(stockImages.images.length + " Items");

    return html;
}
function buildFullScreenNews() {
    html = "";
    for (var i = 0 ; i < news.news.length ; i++) {
        if (news.news[i].active == "1") {
            html += "<table width=\"100%\">";
            html += "    <tr style=\"background-color:silver\">";
            html += "        <td width=\"1\">";
            html += "            <img class=\"article-image\" src=\"" + news.news[i].imagepath + "\" />";
            html += "        </td>";
            html += "        <td width=\"20px\"></td>";
            html += "        <td>";
            html += "            <a target=\"_blank\" href=\"" + news.news[i].link + "\"><u>";
            html += news.news[i].caption;
            html += "            </u></a>";
            html += "            <br /><br /><br />";
            html += news.news[i].source;
            html += "        </td>";
            html += "    </tr>";
            html += "    <tr>";
            html += "        <td height=\"10px\"></td>";
            html += "    </tr>";
            html += "</table>";
        }
    }
    return html;
}
function buildMobileNews() {
    html = "";
    html += "<center>";
    for (var i = 0 ; i < news.news.length ; i++) {
        if (news.news[i].active == "1") {
            html += "<img class=\"article-image\" src=\"" + news.news[i].imagepath + "\" style='max-width:100%' />";
            html += "<br />";
            html += "<a href=\"" + news.news[i].link + "\"><u>";
            html += news.news[i].caption;
            html += "</u></a>";
            html += "<br />";
            html += news.news[i].source;
            html += "<br />";
            html += "<br />";
        }
    }
    html += "</center>";
    return html;
}
function buildNewsManager() {
    var html = "<table id='tblNewsManager' class='row-border' style='width:80%'>";
    html += "<thead><tr><th colspan='2'><center>Actions</center></th><th>Article</th></tr></thead><tbody>";
    for (var i = 0 ; i < news.news.length ; i++) {
        if (news.news[i].active == "1") {
            html += "<tr height=40px><td width=60px><button onclick='openNewsModal(" + news.news[i].id + ");' ";
            html += "class='btn btn-primary'>Edit</button></td>";
            html += "<td width=80px><button ";
            html += "onclick='updateNews(\"" + news.news[i].caption + "\",\"" + news.news[i].link + "\",\"";
            html += news.news[i].source + "\",\"0\",\"" + news.news[i].id + "\");'";
            //caption, link, source, imagepath, active, id
            //html += "onclick=\"updateNews('" + news.news[i].caption + "','" + news.news[i].link + "','" +
            //    news.news[i].source + "','" + news.news[i].imagepath + "','" + news.news[i].active + "','" +
            //    news.news[i].id + "')";
            html += " class='btn btn-danger'>Delete</button></td><td>";
            html += news.news[i].caption;
            html += "</td></tr>";
        }
    }
    html += "<tr height=40px><td colspan=2><center><button onclick='openNewsModal(0);' ";
    html += "class='btn btn-primary'>Add New</button></center></td><td>&nbsp;</td></tr></tbody></table>";
    //$("#newsManager").html(html);
    return html;
}
function getNewsCount() {
    var cnt = 0;
    for (var i = 0 ; i < news.news.length ; i++) {
        if (news.news[i].active == "1") {
            cnt += 1;
        }
    }
    return cnt;
}
function updateNews(caption, link, source, active, id) {
    $("#editNewsModal").modal("hide");
    $.ajax(
    {
        type: "POST",
        url: "updateNews.php",
        async: false,
        data: { caption: caption, link: link, source: source, active: active, id: id },
        success: function (data) {
            $.ajax(
            {
                type: "GET",
                url: "getNews.php",
                success: function (data) {
                    news = eval("(" + data + ")");
                    $("#newsCount1").html(getNewsCount() + " Items");
                    $("#newsCount2").html(getNewsCount() + " Items");
                    $("#newsFullScreenContent").html(buildFullScreenNews());
                    $("#newsMobileContent").html(buildMobileNews());
                    $("#newsManager").html(buildNewsManager());
                    $('#tblNewsManager').DataTable({ 'searching': false, 'lengthChange': false });

                    //msg("getNews: " + data);
                },
                error: function (j, err) {
                    showSystemMessageModal("error getting News: " + j.status);
                }
            });
        },
        error: function (j, err) {
            showSystemMessageModal("error updating news " + j.status);
        }
    });
}
function openNewsModal(id) {
    $("#editNewsModal").modal("show");
    if (id == 0) {
        $("#editNewsCaption").val("");
        $("#editNewsID").val("0");
        $("#editNewsLink").val("");
        $("#editNewsSource").val("");
        $("#editNewsActive").val("1");
        $("#editNewsImagePath").val("");
        $("#editNewsPictureUpload").show();
        $("#editNewsImagePath").hide();
        $("#updateNewsButton").hide();
        $("#addNewsButton").show();
    }
    else {
        for (var i = 0 ; i < news.news.length ; i++) {
            if (news.news[i].id == id) {
                $("#editNewsCaption").val(decode(news.news[i].caption));
                $("#editNewsID").val(news.news[i].id);
                $("#editNewsLink").val(decode(news.news[i].link));
                $("#editNewsSource").val(decode(news.news[i].source));
                $("#editNewsActive").val(news.news[i].active);
                $("#editNewsImagePath").attr("src", news.news[i].imagepath);
                $("#editNewsPictureUpload").hide();
                $("#editNewsImagePath").show();
                $("#updateNewsButton").show();
                $("#addNewsButton").hide();
            }
        }
    }
}
function cleanNewsFilename(inputFile) {
    //msg("inputFile before: " + inputFile);
    for (var i = inputFile.length; i > 0; i--) {
        if (inputFile.substring(i, i + 1) == "\\") {
            inputFile = inputFile.substring(i + 1, 100);
            i = 0;
        }
    }
    $("#trimNewsFile").val(inputFile);
    $("#fileNewsLabel").text($("#trimNewsFile").val());
    //msg("inputFile after: " + $("#trimFile").val());
}
function uploadNews() {
//    $("#editNewsModal").modal("hide");
    var data = new FormData($('#frmNewsUpload')[0]);

    $.ajax({
        url: 'uploadNewsArticle.php',
        type: 'POST',
        data: data,
        cache: false,
        processData: false,
        contentType: false,
        success: function (data) {
            //msg("upload news: " + data);
            $.ajax(
            {
                type: "GET",
                url: "getNews.php",
                success: function (data) {
                    news = eval("(" + data + ")");
                    $("#editNewsModal").modal("hide");
                    $("#newsCount").html(getNewsCount() + " Items");
                    $("#newsFullScreenContent").html(buildFullScreenNews());
                    $("#newsMobileContent").html(buildMobileNews());
                    $("#newsManager").html(buildNewsManager());
                    $('#tblNewsManager').DataTable({ 'searching': false, 'lengthChange': false });

                    //msg("getNews: " + data);
                },
                error: function (j, err) {
                    showSystemMessageModal("error getting News: " + j.status);
                }
            });
        },
        error: function (j, err) {
            msg("error uploading title page image: " + j.status);
        }
    }).fail(function () {
        showSystemMessageModal("AJAX Call failed to upload title page image.");
    });
}

function buildStockImages() {
    html = "";
    for (var i = 0 ; i < stockImages.images.length ; i++) {
        html += "<a href=\"#StockPhotosManagement\" onclick=\"openStockImageModal('" + stockImages.images[i].id;
        html += "');\"><img src='images/autos/" + stockImages.images[i].filename;
        if (stockImages.images[i].title == "")
            html += "' title='" + stockImages.images[i].filename;
        else
            html += "' title='" + stockImages.images[i].title;
        html += "' height='100px' /></a>";
        if (stockImages.images[i].active == "1") {
            html += "<a href=\"#StockPhotosManagement\" onclick=\"updateStockImages(" + stockImages.images[i].id + ",'";
            html += stockImages.images[i].title + "', 0);\" ";
            if (stockImages.images[i].title == "")
                html += "title=\"Disable  (" + stockImages.images[i].filename;
            else
                html += "title=\"Disable  (" + stockImages.images[i].title;
            html += ")\"><img src=\"images/check.jpg\" /></a>";
        }
        else {
            html += "<a href=\"#StockPhotosManagement\" onclick=\"updateStockImages(" + stockImages.images[i].id + ",'";
            html += stockImages.images[i].title + "', 1);\" ";
            if (stockImages.images[i].title == "")
                html += "title=\"Enable  (" + stockImages.images[i].filename;
            else
                html += "title=\"Enable  (" + stockImages.images[i].title;
            html += ")\"><img src=\"images/x.jpg\" /></a>";
        }
    }
    html += "<br /><br /><button onclick='openStockImageModal(0);' class='btn btn-primary'>Add New</button>";

    $("#stockImageResults1").html(stockImages.images.length + " Items");
    $("#stockImageResults2").html(stockImages.images.length + " Items");
    //html += "<form id=\"frmUpload\" enctype=\"multipart/form-data\">";
    //html += "   <div class=\"row\">";
    //html +=         "<div class=\"col-lg-3\">";
    //html += "           <div class=\"panel\" style=\"border 2px white\">";
    //html += "               <input class=\"hidden\" onchange=\"cleanFilename($(this).val());\" ";
    //html += "                   type=\"file\" id=\"fileToUpload\" name=\"fileToUpload\" ";
    //html += "                   accept=\".jpg,.gif,.png,.jpeg\" />";
    //html += "               <label class=\"btn btn-primary\" for=\"fileToUpload\">Select file</label>";
    //html += "               <label id=\"fileLabel\">No file chosen yet</label>";
    //html += "           </div>";
    //html += "           <div id=\"uploadStatus\"></div>";
    //html += "           <input type=\"hidden\" id=\"trimFile\" name=\"trimFile\" />";
    //html += "       </div>";
    //html += "       <div class=\"col-lg-3\">";
    //html += "           <button class=\"btn btn-primary\" onclick=\"uploadStockImage();\">Upload</button>";
    //html += "       </div>";
    //html += "   </div>";
    //html += "</form>";

    return html;
}
function openStockImageModal(id) {
    $("#editStockPhotoModal").modal("show");
    if (id == 0) {
        $("#stockPhotoTitle").val("");
        $("#stockPhotoFilename").val("");
        $("#stockPhotoID").val("0");
        $("#stockPhotoActive").val("1");
        $("#stockPictureUpload").show();
        $("#stockPhotoFilename").hide();
        $("#addStockPictureButton").show();
        $("#updateStockPictureButton").hide();
    }
    else {
        for (var i = 0 ; i < stockImages.images.length ; i++) {
            if (stockImages.images[i].id == id) {
                $("#stockPhotoTitle").val(decode(stockImages.images[i].title));
                $("#stockPhotoFilename").attr("src", "images/autos/" + stockImages.images[i].filename);
                $("#stockPhotoID").val(stockImages.images[i].id);
                $("#stockPhotoActive").val(stockImages.images[i].active);
                $("#stockPhotoFilename").show();
                $("#stockPictureUpload").hide();
                $("#updateStockPictureButton").show();
                $("#addStockPictureButton").hide();
            }
        }
    }
}
function updateStockImages(id, title, active) {
    $("#editStockPhotoModal").modal("hide");
    $.ajax(
    {
        type: "GET",
        url: "updateStockImages.php",
        async: false,
        data: { active: active, title: title, id: id },
        success: function (data) {
            //msg(data);
            $.ajax(
            {
                type: "GET",
                url: "getStockImages.php",
                success: function (data) {
                    stockImages = eval("(" + data + ")");
                    $("#stockImages").html(buildStockImages());
                },
                error: function (j, err) {
                    showSystemMessageModal("error getting stock images: " + j.status);
                }
            });
        },
        error: function (j, err) {
            showSystemMessageModal("error updating stock images " + j.status);
        }
    });
}
function uploadStockImage() {
    $("#editStockPhotoModal").modal("hide");
    var data = new FormData($('#frmStockPictureUpload')[0]);
    $.ajax({
        url: 'uploadStockImage.php',
        type: 'POST',
        data: data,
        cache: false,
        processData: false,
        contentType: false,
        success: function (data) {
            //msg("upload file: " + data);
            var res = eval("(" + data + ")");
            var mesg = "";
            if (res.status == "failure") {
                for (var i = 0; i < res.messages.length; i++) {
                    mesg += res.messages[i].message + "\n";
                }
                //msg("status=failure: " + mesg);
                $("#uploadStatus").html(mesg.replace("\n", "<br>")).show().fadeOut(5000);
            }
            else {
                //msg("status!=failure: " + mesg);
                $("#uploadStatus").html("Uploaded " + $("#trimFile").val()).show().fadeOut(5000, function () {
                    $.ajax(
                    {
                        type: "GET",
                        url: "getStockImages.php",
                        success: function (data) {
                            stockImages = eval("(" + data + ")");
                            $("#stockImages").html(buildStockImages());
                        },
                        error: function (j, err) {
                            showSystemMessageModal("error getting stock images: " + j.status);
                        }
                    });
                });
            }
        },
        error: function (j, err) {
            msg("error uploading stock image: " + j.status);
        }
    }).fail(function () {
        $("#uploadStatus").html("AJAX Call failed to upload stock image.").show().fadeOut(5000);
    });
}
function cleanStockFilename(inputFile) {
    //msg("inputFile before: " + inputFile);
    for (var i = inputFile.length; i > 0; i--) {
        if (inputFile.substring(i, i + 1) == "\\") {
            inputFile = inputFile.substring(i + 1, 100);
            i = 0;
        }
    }
    $("#trimStockFile").val(inputFile);
    $("#stockLabel").text($("#trimStockFile").val());
    //msg("inputFile after: " + $("#trimFile").val());
    $("#addStockPictureButton").removeClass("disabled");
}

function buildFullScreenUsers() {
    html = "";
    html += "<table id='tblFullScreenUsers' class='row-border' cellspacing='0' border='0' style='width:80%'>";
    html += "<thead><tr><th colspan='2'><center>Actions</center></th>";
    html += "<th>Username</th><th>Password</th><th>Email</th><th>Zip Code</th><th>Level</th><th># of Pics</th>";
    html += "</tr></thead><tbody>";
    for (var i = 0 ; i < users.users.length ; i++) {
        html += "    <tr><td width='60px'><button onclick='openUsersModal(" + users.users[i].user.id + ");' ";
        html += "class='btn btn-primary' title='Edit " + users.users[i].user.username + "'>Edit</button></td>";
        html += "<td width='80px'><button ";
        html += "onclick='updateUsers(\"" + users.users[i].user.username + "\",\"" + users.users[i].user.password;
        html += "\",\"" + users.users[i].user.email + "\",\"" + users.users[i].user.zipcode + "\",\"";
        html += users.users[i].user.level + "\",\"" + users.users[i].user.id + "\"";
        if (users.users[i].user.active == "1") {
            html += ",\"0\");'";
            html += " class='btn btn-danger' title='Disable " + users.users[i].user.username + "'>Disable</button></td>";
        }
        else {
            html += ",\"1\");'";
            html += " class='btn btn-success'>Enable</button></td>";
        }
        html += "        <td>";
        html += users.users[i].user.username;
        html += "        </td>";
        html += "        <td>";
        html += "********"; //users.users[i].user.password;
        html += "        </td>";
        html += "        <td>";
        html += users.users[i].user.email;
        html += "        </td>";
        html += "        <td>";
        html += users.users[i].user.zipcode;
        html += "        </td>";
        html += "        <td>";
        html += users.users[i].user.level;
        html += "        </td>";
        html += "        <td><center>";
        if ("pics" in users.users[i])
            html += users.users[i].pics.length;
        else
            html += "0";
        html += "        </center></td>";
        html += "    </tr>";
        if ("pics" in users.users[i]) {
            html += "    <tr><td><img src='";
            if (users.users[i].user.imagePath == "")
                html += "images/noprofilepicture.jpg";
            else
                html += "images/" + users.users[i].user.imagePath;
            html += "' height='50px'/></td><td colspan='6'>";
            for (var j = 0; j < users.users[i].pics.length; j++) {
                html += "    <img src='images/projects/" + users.users[i].pics[j].filename + "' height='50px' ";
                html += "title='" + users.users[i].pics[j].title + "' />";
                if (users.users[i].pics[j].active == "1") {
                    html += "    <a href='#UsersManagement' onclick='updateUserImages(\"" + users.users[i].pics[j].tbl;
                    html += "\", \"" + users.users[i].pics[j].id + "\", \"0\");' title='Disable  (";
                    html += users.users[i].pics[j].title;
                    html += ")'><img src='images/check.jpg' /></a>";
                }
                else {
                    html += "<a href='#UsersManagement' onclick='updateUserImages(\"" + users.users[i].pics[j].tbl;
                    html += "\", \"" + users.users[i].pics[j].id + "\", \"1\");' title='Enable  (";
                    html += users.users[i].pics[j].title;
                    html += ")'><img src='images/x.jpg' /></a>";
                }
                if (((j + 1) % 7) == 0) {
                    html += "    </td><td>&nbsp;</td></tr>";
                    html += "    <tr><td>&nbsp;</td><td colspan='6'>";
                }
            }
            html += "    </td><td>&nbsp;</td></tr>";
        }
    }
    html += "<tr height=40px><td colspan=2><center><button onclick='openUsersModal(0);' ";
    html += "class='btn btn-primary' title='Add a new User'>Add New</button></center></td><td colspan='6'>&nbsp;</td></tr></tbody></table>";
    return html;
}
function buildMobileUsers() {
    html = "";
    html += "<center>";
    for (var i = 0 ; i < news.news.length ; i++) {
        if (users.users[i].user.active == "1") {
            if (users.users[i].user.imagepath == "")
                html += "<img class=\"article-image\" src=\"noprofilepicture.jpg\" />";
            else
                html += "<img class=\"article-image\" src=\"" + users.users[i].user.imagepath + "\" />";
            html += "<br />";
            html += "<a href=\"" + users.users[i].user.link + "\"><u>";
            html += users.users[i].user.caption;
            html += "</u></a>";
            html += "<br />";
            html += users.users[i].user.source;
            html += "<br />";
            html += "<br />";
        }
    }
    html += "</center>";
    return html;
}
function updateUserImages(tbl, id, active) {
    $.ajax(
    {
        type: "POST",
        url: "updateUserImages.php",
        async: false,
        data: { active: active, tbl: tbl, id: id },
        success: function (data) {
            //msg("update users: " + data);
            $.ajax(
            {
                type: "GET",
                url: "getUsers.php",
                success: function (data) {
                    //msg("get users: " + data);
                    users = eval("(" + data + ")");
                    $("#userCount1").html(users.users.length + " Items");
                    $("#userCount2").html(users.users.length + " Items");
                    $("#userFullScreenContent").html(buildFullScreenUsers());
                    //$("#userMobileContent").html(buildMobileUsers());
                    $('#tblFullScreenUsers').DataTable({ 'searching': false, 'lengthChange': false });

                    //msg("getNews: " + data);
                },
                error: function (j, err) {
                    showSystemMessageModal("error getting Users: " + j.status);
                }
            });
        },
        error: function (j, err) {
            showSystemMessageModal("error updating users " + j.status);
        }
    });
}
function updateUsers(username, password, email, zipcode, level, id, active) {
    $("#editUsersModal").modal("hide");
    $.ajax(
    {
        type: "POST",
        url: "updateUsers.php",
        async: false,
        data: { username: username, password: password, email: email, zipcode: zipcode, level: level, active: active, id: id },
        success: function (data) {
            //msg("update users: " + data);
            $.ajax(
            {
                type: "GET",
                url: "getUsers.php",
                success: function (data) {
                    //msg("get users: " + data);
                    users = eval("(" + data + ")");
                    $("#userCount1").html(users.users.length + " Items");
                    $("#userCount2").html(users.users.length + " Items");
                    $("#userFullScreenContent").html(buildFullScreenUsers());
                    //$("#userMobileContent").html(buildMobileUsers());
                    $('#tblFullScreenUsers').DataTable({ 'searching': false, 'lengthChange': false });

                    //msg("getNews: " + data);
                },
                error: function (j, err) {
                    showSystemMessageModal("error getting Users: " + j.status);
                }
            });
        },
        error: function (j, err) {
            showSystemMessageModal("error updating users " + j.status);
        }
    });
}
function openUsersModal(id) {
    $("#editUsersModal").modal("show");
    if (id == 0) {
        $("#editUsersUsername").val("");
        $("#editUsersPassword").val("");
        $("#editUsersEmail").val("");
        $("#editUsersZipcode").val("");
        $("#editUsersLevel").prop("checked", false);
        $("#editUsersID").val("0");
        $("#editUsersActive").val("1");
    }
    else {
        for (var i = 0 ; i < users.users.length ; i++) {
            if (users.users[i].user.id == id) {
                $("#editUsersUsername").val(decode(users.users[i].user.username));
                $("#editUsersPassword").val(decode(users.users[i].user.password)); 
                $("#editUsersEmail").val(decode(users.users[i].user.email));
                $("#editUsersZipcode").val(decode(users.users[i].user.zipcode));
                if (users.users[i].user.level == "admin")
                    $("#editUsersLevel").prop("checked", true);
                else
                    $("#editUsersLevel").prop("checked", false);
                $("#editUsersID").val(users.users[i].user.id);
                $("#editUsersActive").val(users.users[i].user.active);
            }
        }
    }
}

function getProject(projectID) {
    //in the case where it's called from the showPage function, projectID is the index of the projects array, not the actual projectID
    //msg("userid: " + user.user.id + "\nprojectid: " + projectID);
    //msg(JSON.stringify(projects));
    $.ajax({
        type: "GET",
        async: false,
        url: "getProject.php?ProjectID=" + projectID + "&TMUserID=" + user.user.id,
        success: function (data) {
            //msg("getProject: " + data);
            log("getProject: " + data.substring(1, 100));
            try {
                project = eval(data);
            }
            catch (e) {
                msg(e);
            }
            //msg("finished eval");
            buildProjectImages();
            //msg("project: " + project.project.name);
        },
        error: function (j, err) {
            msg("error getting project: " + j.status);
        }
    }).fail(function () {
        msg("AJAX Call failed to get project");
    });
    if (projectID == "-1")
        return;
    //msg(projects.projects[projectID].id);
    $("#projectFormAddPost").html("<button class='btn btn-primary' onclick='openForumModal(\"Project\"" +
        ", \"0\", \"" + user.user.id + "\", \"1\", \"0\", " + 
        project.project.id + ");'>Add Comment</button>");
    $.ajax(
    {
        type: "GET",
        url: "getForum.php?ParentObject=Project&ParentID=0&projectID=" + project.project.id,
        success: function (data) {
            //msg("project forum: " + data);
            forum = eval("(" + data + ")");
            //msg(forum.forum.length);
            //msg(forum.forum[0].subForums.length);
            html = "<table border='0' width='100%'><tr><td>";
            html += buildForumTable(forum, 0, "0", "project");
            html += "</td></tr></table>";
            //msg("html: " + html);
            $("#projectForum").html(html);
            //$("#forumCount").html(users.users.length + " Items");
            //$("#userFullScreenContent").html(buildFullScreenUsers());
            ////$("#userMobileContent").html(buildMobileUsers());
            //$('#tblFullScreenUsers').DataTable({ 'searching': false, 'lengthChange': false });

            //msg("getNews: " + data);
        },
        error: function (j, err) {
            showSystemMessageModal("error getting forum: " + j.status);
        }
    });
}
function openProjectImageModal(id) {
    //msg(JSON.stringify(project));
    $("#editProjectPictureModal").modal("show");
    $("#editProjectPictureProjectID").val(project.project.id);
    if (id == "-1") {
        $("#editProjectPictureID").val(id);
        $("#editProjectPictureTitle").val("");
        $("#editProjectPictureCover").prop("checked", false);
        $("#editProjectPictureDescription").val("");
        //$("#editProjectPicturePhoto").attr("src", "");
        $("#editProjectPictureGetPhotoLabel").text("No file chosen yet");
        $("#editProjectPictureHideButton").hide();
        $("#editProjectPictureSaveButton").addClass("disabled");
        $("#editProjectPicturePhotoShowPictureContainer").hide();
        $("#editProjectPicturePhotoGetPictureContainer").show();
    }
    else {
        $("#editProjectPictureID").val(project.images[id].id);
        $("#editProjectPictureTitle").val(decode(project.images[id].title));
        if (project.images[id].coverphoto == "1")
            $("#editProjectPictureCover").prop("checked", true);
        else
            $("#editProjectPictureCover").prop("checked", false);
        $("#editProjectPictureDescription").val(decode(project.images[id].description));
        if (user.user.id == project.project.userID)
            $("#editProjectPictureSaveButton").removeClass("disabled");
        else
            $("#editProjectPictureSaveButton").addClass("disabled");
        $("#editProjectPictureHideButton").show();
        if (user.user.id == project.project.userID)
            $("#editProjectPictureHideButton").removeClass("disabled");
        else
            $("#editProjectPictureHideButton").addClass("disabled");
        $("#editProjectPicturePhotoShowPictureContainer").show();
        $("#editProjectPicturePhotoGetPictureContainer").hide();
        $("#editProjectPicturePhoto").attr("src", "images/projects/" + project.images[id].filename);
    }
}
function openProjectPartModal(id) {
    $("#editProjectPartsModal").modal("show");
    $("#editProjectPartProjectID").val(project.project.id);
    if (id == "-1") {
        $("#editProjectPartID").val(id);
        $("#editProjectPartTitle").val("");
        $("#editProjectPartPrice").val("");
        $("#editProjectPartVendor").val("");
        $("#editProjectPartDescription").val("");
        $("#editProjectPartGetPhotoLabel").text("No file chosen yet");
        $("#editProjectPartHideButton").hide();
        $("#editProjectPartSaveButton").addClass("disabled");
        $("#editProjectPartPhotoShowPictureContainer").hide();
        $("#editProjectPartPhotoGetPictureContainer").show();
    }
    else {
        $("#editProjectPartID").val(project.parts[id].id);
        $("#editProjectPartTitle").val(decode(project.parts[id].title));
        $("#editProjectPartPrice").val(decode(project.parts[id].pricepaid));
        $("#editProjectPartVendor").val(decode(project.parts[id].vendorlink));
        $("#editProjectPartDescription").val(decode(project.parts[id].description));
        $("#editProjectPartHideButton").show();
        if (user.user.id == project.project.userID)
            $("#editProjectPartHideButton").removeClass("disabled");
        else
            $("#editProjectPartHideButton").addClass("disabled");
        if (user.user.id == project.project.userID)
            $("#editProjectPartSaveButton").removeClass("disabled");
        else
            $("#editProjectPartSaveButton").addClass("disabled");
        $("#editProjectPartPhotoShowPictureContainer").show();
        $("#editProjectPartPhotoGetPictureContainer").hide();
        $("#editProjectPartPhoto").attr("src", "images/projects/" + project.parts[id].filename);
    }
}
function buildProjectImages() {
    html = "";
    //msg("number of images: " + project.images.length);
    for (var i = 0; i < project.images.length; i++) {
        if (project.images[i].active == "1") {
            html += "<a href='javascript:void(0);' onclick='openProjectImageModal(";
            html += i + ");'><span class=''><img src='images/projects/" + project.images[i].filename;
            html += "' height='100px' title='" + project.images[i].title + "' /></span></a>";
            //html += "<div class='tooltiptext'><table><tr><td><b>" + project.images[i].title + "</b></td></tr>";
            //html += "<tr><td>" + project.images[i].description + "</td></tr></table></div></div>";
        }
    }
    $("#projectPhotos").html(html);
    buildProjectParts();
}
function buildProjectParts() {
    html = "";
    cnt = 0;
    //msg("number of parts: " + project.parts.length);
    for (var i = 0; i < project.parts.length; i++) {
        if (project.parts[i].active == "1") {
            //coming from parts landing page or direct link into it
            if ((location.toString().indexOf("#Parts") > 0) || (location.toString().indexOf("?ProjectPart") > 0)) {
                html += "<a href='#Parts' onclick='";
                html += "showNewPartImages(\"" + project.parts[i].fullpath + "\");";
            }
            else {
                //coming from project pictures landing page
                if (location.toString().indexOf("#Photos") > 0) {
                    html += "<a href='#Parts' onclick='";
                    html += "showNewPart(\"" + project.project.id + "\",\"" + project.parts[i].fullpath + "\");";
                }
                else {
                    //coming from the project pic direct link
                    if (location.toString().indexOf("?ProjectPic") > 0) {
                        t = project.parts[i].filename.split(".");
                        html += "<a href='" + compileLink("?ProjectPart=" + t[0] + "&p=" + project.project.id) + "' onclick='";
                    }
                    else {
                        //coming from the my project page
                        html += "<a href='javascript:void(0);' onclick='";
                        html += "openProjectPartModal(" + i + ");";
                    }
                }
            }
            html += "'><img src='images/projects/" + project.parts[i].filename;
            html += "' height='100px' title='" + project.parts[i].title + "' /></a>";
            cnt += 1;
        }
    }
    $("#projectParts").html(html);
    if (cnt == 0)
        $("#myProjectPartsSection").hide();
}
function saveProjectPicture(projectID, pictureID, title, description, coverphoto, active) {
    //msg("projectID: " + projectID + "\npictureID: " + pictureID + "\ntitle: " + title + "\ndescription: " + description + "\nactive: " + active);
    var data = new FormData($('#editProjectPictureForm')[0]);
    $.ajax(
    {
        url: "updateProjectPicture.php?active=" + active + "&cover=" + coverphoto,
        type: 'POST',
        data: data,
        cache: false,
        processData: false,
        contentType: false,
        success: function (data) {
            //msg("updateProjectPicture: " + data);
            getProject(projectID);
        },
        error: function (j, err) {
            msg("error updating project picture " + j.status);
        }
    }).fail(function () {
        msg("AJAX Call failed to update project picture.");
    });
    $("#editProjectPictureModal").modal("hide");
}
function saveProjectPart(projectID, partID, title, description, pricepaid, vendorlink, active) {
    //msg("projectID: " + projectID + "\npictureID: " + pictureID + "\ntitle: " + title + "\ndescription: " + description + "\nactive: " + active);
    var data = new FormData($('#editProjectPartsForm')[0]);
    $.ajax(
    {
        type: "POST",
        url: "updateProjectPart.php?active=" + active,
        data: data,
        cache: false,
        async: false,
        processData: false,
        contentType: false,
        success: function (data) {
            //msg("updateProjectPart: " + data);
            getProject(projectID);
        },
        error: function (j, err) {
            showSystemMessageModal("error updating project part " + j.status);
        }
    }).fail(function () {
        //msg("AJAX Call failed to update project part");
    });
    $("#editProjectPartsModal").modal("hide");
}
function enablePartToProjectSaveBtn(id) {
    $("#txtPartToProjectProjectID").val(id);
    $("#btnPartToProjectSave").removeClass("disabled");
}
function enablePhotoToProjectSaveBtn(id) {
    $("#txtPhotoToProjectProjectID").val(id);
    $("#btnPhotoToProjectSave").removeClass("disabled");
}
function savePartToProject() {
    $.ajax(
    {
        type: "GET",
        url: "addPartToProject.php?projectID=" + $("#txtPartToProjectProjectID").val() + "&partPath=" + PartHolding.substring(16, 1000),
        success: function (data) {
        },
        error: function (j, err) {
            showSystemMessageModal("error saving part to project: " + j.status);
        }
    });
    $("#savePartToProjectModal").modal("hide");
    //PartHolding = "";
}
function savePhotoToProject() {
    $.ajax(
    {
        type: "GET",
        url: "addPhotoToProject.php?projectID=" + $("#txtPhotoToProjectProjectID").val() + "&photoPath=" + PhotoHolding.substring(16, 1000),
        success: function (data) {
        },
        error: function (j, err) {
            showSystemMessageModal("error saving photo to project: " + j.status);
        }
    });
    $("#savePhotoToProjectModal").modal("hide");
    //PartHolding = "";
}
function getUserProjects(TMUserID) {
    //msg(TMUserID);
    $.ajax({
        type: "GET",
        url: "getUserProjects.php?TMUserID=" + TMUserID,
        success: function (data) {
            //msg("getUserProjects: " + data);
            projects = eval(data);
            createProjectBoxes();
            html = "";
            for (var i = 0; i < projects.projects.length; i++) {
                if (projects.projects[i].id != project.project.id) {
                    html += "<label><input type='radio' id='optPartProject' name='optProject' ";
                    html += "onclick='enablePartToProjectSaveBtn(\"" + projects.projects[i].id + "\");'";
                    html += " value='" + projects.projects[i].id + "'> ";
                    html += projects.projects[i].name;
                    html += "</label><br>";
                }
            }
            $("#savePartToProjectProjectList").html(html);

            //msg("user projects: " + projects.projects.length);
        },
        error: function (j, err) {
            msg("error getting user projects: " + j.status);
        }
    }).fail(function () {
        msg("AJAX Call failed to get user projects");
    });
}
function loginUser(username, password) {
    $.ajax({
        type: "GET",
        url: "loginUser.php",
        data: "username=" + encode(username) + "&password=" + encode(password),
        success: function (data) {
            //alert("Login User: " + data);
            user = eval("(" + data + ")");
            if ("error" in user.user) {
                showSystemMessageModal(user.user.error);
            }
            else {
                $.ajax({
                    type: "POST",
                    url: "setCookie.php",
                    data: "name=user&value=" + JSON.stringify(user),
                    success: function (data) {
                        //msg("set cookie: " + data);
                        $("#loginModal").modal("hide");
                        //$("#liLogin").hide();
                        //$("#liRegister").html("<a id=\"profileMenu\" href=\"#Profile\" onclick='showPage(\"profilePage.php\", \"profileMenu\")'>Profile</a>");
                        $("#liRegister").html("<a href=\"" + compileLink("#MyGarage") + "\" class=\"blackmenu\" onclick='showPage(\"myGaragePage.php\", \"myGarageMenu\");'>My Garage</a>");
                        $("#liLogin").html("<a href=\"" + compileLink("#Home") + "\" class=\"blackmenu\" onclick='logOut();'>Sign Out</a>");
                        $("#liRegister2").html("<a href=\"" + compileLink("#MyGarage") + "\" class=\"redlogin\" onclick='showPage(\"myGaragePage.php\", \"myGarageMenu\");'>My Garage</a>");
                        $("#liLogin2").html("<a href=\"" + compileLink("#Home") + "\" class=\"redlogin\" onclick='logOut();'>SIGN OUT</a>");
                        showPage("myGaragePage.php", "myGarageMenu");
                    },
                    error: function (j, err) {
                        //showSystemMessageModal("error setting cookie: " + j.status);
                    }
                });
            }
        }
    });
}
function logOut() {
    PartHolding = "";
    PhotoHolding = "";
    $("#liRegister").html("<a href=\"javascript:void(0);\" class=\"blackmenu\" data-toggle=\"modal\" data-target=\"#registerModal\">Register</a>");
    $("#liLogin").html("<a href=\"javascript:void(0);\" class=\"blackmenu\" data-toggle=\"modal\" data-target=\"#loginModal\">SIGN IN</a>");
    $("#liRegister2").html("<a href=\"javascript:void(0);\" class=\"redlogin\" data-toggle=\"modal\" data-target=\"#registerModal\">Register</a>");
    $("#liLogin2").html("<a href=\"javascript:void(0);\" class=\"redlogin\" data-toggle=\"modal\" data-target=\"#loginModal\">SIGN IN</a>");
    $.ajax({
        type: "POST",
        url: "setCookie.php",
        data: "name=user&value=",
        success: function (data) {
            //msg("set cookie: " + data);
            showPage("home.php", "homeMenu");
        },
        error: function (j, err) {
            //showSystemMessageModal("error setting cookie: " + j.status);
        }
    });
    user = "({\"user\": {\"email\": \"\", \"username\": \"Fake User\", \"zipcode\": \"\", ";
    user += "\"password\": \"\", \"ts\": \"\", \"id\": \"0\", \"level\": \"standard\"}})";
    user = eval(user);
}
function showCars() {
    $("#myGarageCars").html("");
    //showSystemMessageModal(JSON.stringify(user));
    if ("pics" in user) {
        var s = "";
        for (var i = 0; i < user.pics.length; i++) {
            s += "<div class=\"col-lg-6\"><img class=\"img-thumbnail\" src=\"images/autos/";
            s += user.pics[i].filename + "\" ";
            s += "title=\"" + user.pics[i].year + " " + user.pics[i].make + " ";
            s += user.pics[i].model + " " + user.pics[i].trim;
            s += "\"></div>";
        }

        $("#myGarageCars").html(s);
    }
}
function registerUser() {
    $.ajax({
        type: "POST",
        url: "saveNewUser.php",
        data: "email=" + encode($("#registerEmail").val()) +
                "&username=" + encode($("#registerUser").val()) +
                "&zipcode=" + encode($("#registerZip").val()) +
                "&password=" + encode($("#registerPassword").val()),
        success: function (data) {
            //msg("save user: " + data);
            user = eval("(" + data + ")");
            if ("error" in user.user) {
                showSystemMessageModal(user.user.error);
            }
            else {
                //msg(user.user.message);
                $("#registerModal").modal("hide");
                $.ajax({
                    type: "POST",
                    url: "setCookie.php",
                    data: "name=user&value=" + JSON.stringify(user),
                    success: function (data) {
                        //msg("setCookie: " + data);
                        $("#liRegister").html("<a href=\"" + compileLink("#MyGarage") + "\" class=\"blackmenu\" onclick='showPage(\"myGaragePage.php\", \"myGarageMenu\");'>My Garage</a>");
                        $("#liLogin").html("<a href=\"" + compileLink("#Home") + "\" class=\"blackmenu\" onclick='logOut();'>Sign Out</a>");
                        $("#liRegister2").html("<a href=\"" + compileLink("#MyGarage") + "\" class=\"redlogin\" onclick='showPage(\"myGaragePage.php\", \"myGarageMenu\");'>My Garage</a>");
                        $("#liLogin2").html("<a href=\"" + compileLink("#Home") + "\" class=\"redlogin\" onclick='logOut();'>SIGN OUT</a>");
                        showPage("myGaragePage.php", "myGarageMenu");
                    },
                    error: function (j, err) {
                        //showSystemMessageModal("error setting cookie: " + j.status);
                    }
                });
            }
        },
        error: function (j, err) {
            showSystemMessageModal("error saving user: " + j.status);
        }
    });
}
function cleanFilename(inputFile, trimFile, trimLabel) {
    for (var i = inputFile.length; i > 0; i--) {
        if (inputFile.substring(i, i + 1) == "\\") {
            inputFile = inputFile.substring(i + 1, 100);
            i = 0;
        }
    }
    $("#" + trimFile).val(inputFile);
    $("#" + trimLabel).text(inputFile);
    //msg("inputFile after: " + $("#trimFile").val());
    $("#editCoverPhotoButton").removeClass("disabled");
    $("#editProfilePictureButton").removeClass("disabled");
    $("#editProjectPictureSaveButton").removeClass("disabled");
    $("#editProjectPartSaveButton").removeClass("disabled");

}
function saveMyProject(id, TMUserID, name, description, year, make, model, trim, builtBy, active) {
    //msg(name);
    $.ajax(
    {
        type: "POST",
        url: "updateProject.php",
        async: false,
        data: { id: id, TMUserID: TMUserID, name: name, description: description, year: year, make: make, model: model, trim: trim, builtBy: builtBy, active: active },
        success: function (data) {
            //msg("saveMyProject: " + data);
            if (id == "-1") {
                res = eval(data);
                projectID = res.newID;
                $("#btnAddProjectPhoto").removeClass("disabled");
                $("#btnAddProjectPart").removeClass("disabled");
                if (PartHolding != "") {
                    $("#txtPartToProjectProjectID").val(projectID);
                    savePartToProject();
                    PartHolding = "";
                }
                if (PhotoHolding != "") {
                    $("#txtPhotoToProjectProjectID").val(projectID);
                    savePhotoToProject();
                    PhotoHolding = "";
                }
                setTimeout(function () {
                    $.ajax({
                        type: "GET",
                        url: "getProject.php?ProjectID=" + projectID + "&TMUserID=" + user.user.id,
                        success: function (data) {
                            project = eval(data);
                            $("#myProjectID").val(project.project.id);
                            //msg("getProject: " + data);
                            buildProjectImages();
                            $("#btnMyProjectDelete").removeClass("disabled");
                            //msg("project: " + project.project.name);
                            $("#projectFormAddPost").html("<button class='btn btn-primary' onclick='openForumModal(\"Project\"" +
                                ", \"0\", \"" + user.user.id + "\", \"1\", \"0\", " +
                                project.project.id + ");'>Add Post</button>");
                            $.ajax(
                            {
                                type: "GET",
                                url: "getForum.php?ParentObject=Project&ParentID=0&projectID=" + project.project.id,
                                success: function (data) {
                                    //msg("project forum: " + data);
                                    forum = eval("(" + data + ")");
                                    html = "<table border='0' width='100%'><tr><td>";
                                    html += buildForumTable(forum, 0, "0", "project");
                                    html += "</td></tr></table>";
                                    $("#projectForum").html(html);
                                },
                                error: function (j, err) {
                                    showSystemMessageModal("error getting forum: " + j.status);
                                }
                            });
                        },
                        error: function (j, err) {
                            msg("error getting project: " + j.status);
                        }
                    }).fail(function () {
                        msg("AJAX Call failed to get project");
                    });
                }, 0);
            }
            else {
                showPage("myGaragePage.php", "myGarageMenu");
            }
        },
        error: function (j, err) {
            showSystemMessageModal("error updating project part " + j.status);
        }
    }).fail(function () {
        msg("AJAX Call failed to update project");
    });
}
function uploadMyGarageCar() {
    return;
    //not used since changing to My Garage format
    var data = new FormData($('#frmUpload')[0]);
    $.ajax({
        url: 'uploadMyGarageCar.php',
        type: 'POST',
        data: data,
        cache: false,
        processData: false,
        contentType: false,
        success: function (data) {
            //msg("upload file: " + data);
            var res = eval("(" + data + ")");
            var mesg = "";
            if (res.status == "failure") {
                for (var i = 0; i < res.messages.length; i++) {
                    mesg += res.messages[i].message + "\n";
                }
                //msg("status=failure: " + mesg);
                $("#uploadStatus").html(mesg.replace("\n", "<br>")).show().fadeOut(5000);
            }
            else {
                //msg("status!=failure: " + mesg);
                $("#uploadStatus").html("Uploaded " + $("#trimFile").val()).show().fadeOut(5000);
                saveUserPicture(res.file);
            }
        }
    }).fail(function () {
        $("#uploadStatus").html("AJAX Call failed to upload picture.").show().fadeOut(5000);
    });
}
function saveCoverPhoto(status) {
    $("#updateCoverPhotoModal").modal("hide");
    var data = new FormData($('#editCoverPhotoForm')[0]);
    $.ajax({
        url: 'updateCoverPhoto.php',
        type: 'POST',
        data: data,
        cache: false,
        processData: false,
        contentType: false,
        success: function (data) {
            //msg("upload file: " + data);
            var res = eval("(" + data + ")");
            var mesg = "";
            if (res.status == "failure") {
                for (var i = 0; i < res.messages.length; i++) {
                    mesg += res.messages[i].message + "\n";
                }
                //msg("status=failure: " + mesg);
                $("#" + status).html(mesg.replace("\n", "<br>")).show().fadeOut(5000);
                //msg("status==failure: " + mesg);
            }
            else {
                //msg("status!=failure: " + mesg);
                $("#" + status).html("Uploaded " + $("#trimFile").val()).show().fadeOut(5000);
                user.user.coverphoto = res.file;
                $("#header").html("<img id='headerImage' src='images/" + user.user.coverphoto + "' style='width:100%;height:" + max_height + "px;' />");
            }
        }
    }).fail(function () {
        //msg("AJAX Call failed to upload cover photo.");
        $("#" + status).html("AJAX Call failed to upload cover photo.").show().fadeOut(5000);
    });
}
function saveUserPicture(filename) {
    $.ajax({
        type: "POST",
        url: "saveUserPicture.php",
        data: "username=" + user.user.username +
            "&filename=" + filename +
            "&project=" + $("#project").val() +
            "&year=" + $("#year").val() +
            "&make=" + $("#make").val() +
            "&model=" + $("#model").val() +
            "&trim=" + $("#trim").val() +
            "&password=" + user.user.password,
        success: function (data) {
            saveData = data;
            $.ajax({
                type: "GET",
                url: "loginUser.php",
                data: "username=" + user.user.username +
                        "&password=" + user.user.password,
                success: function (data) {
                    //msg("get users: " + data);
                    user = eval("(" + data + ")");
                    $("#uploadStatus").html($("#uploadStatus").html() + "<br>" + saveData.replace("\n", "<br>")).show().fadeOut(5000, function () {
                        $("#fileLabel").text("No file chosen yet");
                        $("#trimFile").val("");
                        $("#project").val("");
                        $("#year").val("");
                        $("#make").val("");
                        $("#model").val("");
                        $("#trim").val("");
                        showCars();
                        $.ajax({
                            type: "POST",
                            url: "setCookie.php",
                            data: "name=user&value=" + JSON.stringify(user),
                            success: function (data) {
                                //msg("save user picture: " + data);
                            }
                        });
                    });
                }
            });
        },
        error: function (jqXHR, status, err) {
            $("#uploadStatus").html("AJAX Call failed to save picture record.").show().fadeOut(5000);
        }
    });
}
function openUpdateCoverPhotoModal() {
    $("#updateCoverPhotoModal").modal("show");
    $("#editCoverPhotoUserID").val(user.user.id);
    $("#editCoverPhotoButton").addClass("disabled");
}
function openEditProfilePictureModal() {
    $("#editProfilePictureModal").modal("show");
    $("#editProfilePictureUserID").val(user.user.id);
    $("#editProfilePictureButton").addClass("disabled");
}
function saveProfilePicture() {
    $("#editProfilePictureModal").modal("hide");
    var data = new FormData($('#editProfilePictureForm')[0]);
    $.ajax({
        url: 'updateProfilePicture.php',
        type: 'POST',
        data: data,
        cache: false,
        processData: false,
        contentType: false,
        success: function (data) {
            //msg("upload file: " + data);
            var res = eval("(" + data + ")");
            var mesg = "";
            if (res.status == "failure") {
                for (var i = 0; i < res.messages.length; i++) {
                    mesg += res.messages[i].message + "\n";
                }
                //msg("status=failure: " + mesg);
                //$("#" + status).html(mesg.replace("\n", "<br>")).show().fadeOut(5000);
                //msg("status==failure: " + mesg);
            }
            else {
                //msg("status!=failure: " + mesg);
                //$("#" + status).html("Uploaded " + $("#trimFile").val()).show().fadeOut(5000);
                user.user.imagePath = res.file;
                if (user.user.imagePath == "")
                    $("#imgMyGaragePersonalPhoto").attr("src", "images/noprofilepicture.jpg");
                else
                    $("#imgMyGaragePersonalPhoto").attr("src", "images/" + user.user.imagePath);
            }
        }
    }).fail(function () {
        //msg("AJAX Call failed to upload cover photo.");
        $("#" + status).html("AJAX Call failed to upload cover photo.").show().fadeOut(5000);
    });
}
function encode(input) {
    //http://ee.hawaii.edu/~tep/EE160/Book/chap4/subsection2.1.1.1.html
    output = input;
    for (var i = 0; i < 10; i++) {
        output = output.replace("'", "[039]");  //single quote
        output = output.replace(";", "[059]");  //semi-colon
        output = output.replace("\"", "[034]"); //double quote
        output = output.replace("\\", "[092]"); //backslash
    }
    return output;
}
function decode(input) {
    output = input;
    for (var i = 0; i < 100; i++) {
        output = output.replace("[039]", "'");
        output = output.replace("[059]", ";");
        output = output.replace("[034]", "\"");
        output = output.replace("[092]", "\\");
        output = output.replace("[013]", String.fromCharCode(13));
        //        output = output.replace("[009]", chr(9));
//        output = output.replace("[013]", chr(13));
    }
    return output;
}
function closeSystemMessageModal() {
    $("#systemMessageModal").modal("hide");
}
function showSystemMessageModal(message) {
    $("#systemMessageModal").modal("show");
    $("#systemMessage").html(message);
    $("#systemMessageCloseButton").focus();
}