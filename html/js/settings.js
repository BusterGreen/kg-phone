KG.Phone.Settings = {};
KG.Phone.Settings.Background = "default-kgcore";
KG.Phone.Settings.OpenedTab = null;
KG.Phone.Settings.Backgrounds = {
    'default-kgcore': {
        label: "Standard KGCore"
    }
};

var PressedBackground = null;
var PressedBackgroundObject = null;
var OldBackground = null;
var IsChecked = null;

$(document).on('click', '.settings-app-tab', function(e){
    e.preventDefault();
    var PressedTab = $(this).data("settingstab");

    if (PressedTab == "background") {
        KG.Phone.Animations.TopSlideDown(".settings-"+PressedTab+"-tab", 200, 0);
        KG.Phone.Settings.OpenedTab = PressedTab;
    } else if (PressedTab == "profilepicture") {
        KG.Phone.Animations.TopSlideDown(".settings-"+PressedTab+"-tab", 200, 0);
        KG.Phone.Settings.OpenedTab = PressedTab;
    } else if (PressedTab == "numberrecognition") {
        var checkBoxes = $(".numberrec-box");
        KG.Phone.Data.AnonymousCall = !checkBoxes.prop("checked");
        checkBoxes.prop("checked", KG.Phone.Data.AnonymousCall);

        if (!KG.Phone.Data.AnonymousCall) {
            $("#numberrecognition > p").html('Off');
        } else {
            $("#numberrecognition > p").html('On');
        }
    }
});

$(document).on('click', '#accept-background', function(e){
    e.preventDefault();
    var hasCustomBackground = KG.Phone.Functions.IsBackgroundCustom();

    if (hasCustomBackground === false) {
        KG.Phone.Notifications.Add("fas fa-paint-brush", "Settings", KG.Phone.Settings.Backgrounds[KG.Phone.Settings.Background].label+" is set!")
        KG.Phone.Animations.TopSlideUp(".settings-"+KG.Phone.Settings.OpenedTab+"-tab", 200, -100);
        $(".phone-background").css({"background-image":"url('/html/img/backgrounds/"+KG.Phone.Settings.Background+".png')"})
    } else {
        KG.Phone.Notifications.Add("fas fa-paint-brush", "Settings", "Personal background set!")
        KG.Phone.Animations.TopSlideUp(".settings-"+KG.Phone.Settings.OpenedTab+"-tab", 200, -100);
        $(".phone-background").css({"background-image":"url('"+KG.Phone.Settings.Background+"')"});
    }

    $.post('https://kg-phone/SetBackground', JSON.stringify({
        background: KG.Phone.Settings.Background,
    }))
});

KG.Phone.Functions.LoadMetaData = function(MetaData) {
    if (MetaData.background !== null && MetaData.background !== undefined) {
        KG.Phone.Settings.Background = MetaData.background;
    } else {
        KG.Phone.Settings.Background = "default-kgcore";
    }

    var hasCustomBackground = KG.Phone.Functions.IsBackgroundCustom();

    if (!hasCustomBackground) {
        $(".phone-background").css({"background-image":"url('/html/img/backgrounds/"+KG.Phone.Settings.Background+".png')"})
    } else {
        $(".phone-background").css({"background-image":"url('"+KG.Phone.Settings.Background+"')"});
    }

    if (MetaData.profilepicture == "default") {
        $("[data-settingstab='profilepicture']").find('.settings-tab-icon').html('<img src="./img/default.png">');
    } else {
        $("[data-settingstab='profilepicture']").find('.settings-tab-icon').html('<img src="'+MetaData.profilepicture+'">');
    }
}

$(document).on('click', '#cancel-background', function(e){
    e.preventDefault();
    KG.Phone.Animations.TopSlideUp(".settings-"+KG.Phone.Settings.OpenedTab+"-tab", 200, -100);
});

KG.Phone.Functions.IsBackgroundCustom = function() {
    var retval = true;
    $.each(KG.Phone.Settings.Backgrounds, function(i, background){
        if (KG.Phone.Settings.Background == i) {
            retval = false;
        }
    });
    return retval
}

$(document).on('click', '.background-option', function(e){
    e.preventDefault();
    PressedBackground = $(this).data('background');
    PressedBackgroundObject = this;
    OldBackground = $(this).parent().find('.background-option-current');
    IsChecked = $(this).find('.background-option-current');

    if (IsChecked.length === 0) {
        if (PressedBackground != "custom-background") {
            KG.Phone.Settings.Background = PressedBackground;
            $(OldBackground).fadeOut(50, function(){
                $(OldBackground).remove();
            });
            $(PressedBackgroundObject).append('<div class="background-option-current"><i class="fas fa-check-circle"></i></div>');
        } else {
            KG.Phone.Animations.TopSlideDown(".background-custom", 200, 13);
        }
    }
});

$(document).on('click', '#accept-custom-background', function(e){
    e.preventDefault();

    KG.Phone.Settings.Background = $(".custom-background-input").val();
    $(OldBackground).fadeOut(50, function(){
        $(OldBackground).remove();
    });
    $(PressedBackgroundObject).append('<div class="background-option-current"><i class="fas fa-check-circle"></i></div>');
    KG.Phone.Animations.TopSlideUp(".background-custom", 200, -23);
});

$(document).on('click', '#cancel-custom-background', function(e){
    e.preventDefault();

    KG.Phone.Animations.TopSlideUp(".background-custom", 200, -23);
});

// Profile Picture

var PressedProfilePicture = null;
var PressedProfilePictureObject = null;
var OldProfilePicture = null;
var ProfilePictureIsChecked = null;

$(document).on('click', '#accept-profilepicture', function(e){
    e.preventDefault();
    var ProfilePicture = KG.Phone.Data.MetaData.profilepicture;
    if (ProfilePicture === "default") {
        KG.Phone.Notifications.Add("fas fa-paint-brush", "Settings", "Standard avatar set!")
        KG.Phone.Animations.TopSlideUp(".settings-"+KG.Phone.Settings.OpenedTab+"-tab", 200, -100);
        $("[data-settingstab='profilepicture']").find('.settings-tab-icon').html('<img src="./img/default.png">');
    } else {
        KG.Phone.Notifications.Add("fas fa-paint-brush", "Settings", "Personal avatar set!")
        KG.Phone.Animations.TopSlideUp(".settings-"+KG.Phone.Settings.OpenedTab+"-tab", 200, -100);
        $("[data-settingstab='profilepicture']").find('.settings-tab-icon').html('<img src="'+ProfilePicture+'">');
    }
    $.post('https://kg-phone/UpdateProfilePicture', JSON.stringify({
        profilepicture: ProfilePicture,
    }));
});

$(document).on('click', '#accept-custom-profilepicture', function(e){
    e.preventDefault();
    KG.Phone.Data.MetaData.profilepicture = $(".custom-profilepicture-input").val();
    $(OldProfilePicture).fadeOut(50, function(){
        $(OldProfilePicture).remove();
    });
    $(PressedProfilePictureObject).append('<div class="profilepicture-option-current"><i class="fas fa-check-circle"></i></div>');
    KG.Phone.Animations.TopSlideUp(".profilepicture-custom", 200, -23);
});

$(document).on('click', '.profilepicture-option', function(e){
    e.preventDefault();
    PressedProfilePicture = $(this).data('profilepicture');
    PressedProfilePictureObject = this;
    OldProfilePicture = $(this).parent().find('.profilepicture-option-current');
    ProfilePictureIsChecked = $(this).find('.profilepicture-option-current');
    if (ProfilePictureIsChecked.length === 0) {
        if (PressedProfilePicture != "custom-profilepicture") {
            KG.Phone.Data.MetaData.profilepicture = PressedProfilePicture
            $(OldProfilePicture).fadeOut(50, function(){
                $(OldProfilePicture).remove();
            });
            $(PressedProfilePictureObject).append('<div class="profilepicture-option-current"><i class="fas fa-check-circle"></i></div>');
        } else {
            KG.Phone.Animations.TopSlideDown(".profilepicture-custom", 200, 13);
        }
    }
});

$(document).on('click', '#cancel-profilepicture', function(e){
    e.preventDefault();
    KG.Phone.Animations.TopSlideUp(".settings-"+KG.Phone.Settings.OpenedTab+"-tab", 200, -100);
});


$(document).on('click', '#cancel-custom-profilepicture', function(e){
    e.preventDefault();
    KG.Phone.Animations.TopSlideUp(".profilepicture-custom", 200, -23);
});
