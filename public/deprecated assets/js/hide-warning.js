let password = "";
let repassword = "";
		
console.log("read read");

const signinError = () => {
    const warning = document.querySelector('.signin-warning');
    warning.classList.remove('hide-warning');
    document.querySelector(`.usernameSi`).addEventListener('keyup', (e) => {
        toggleCall(e);
    });
    document.querySelector(`.emailSi`).addEventListener('keyup', (e) => {
        toggleCall(e);
    });
    document.querySelector(`.passwordSi`).addEventListener('keyup', (e) => {
        toggleCall(e);
    });
}

const toggleCall = (event) => {
    const currentKeys = event;
    let currentKeysUp = '';
    currentKeysUp = currentKeysUp ? currentKeysUp + currentKeys : currentKeys;
    if (currentKeysUp.length != 0) { warningToggle(true, 'signin-warning') }
}

function handleOnKeyUp (input, event) {
    const currentKeys = document.querySelector(`#${input}`);
    const button = document.querySelector('.submit');
    let currentKeysUp = '';
    currentKeysUp = currentKeysUp ? currentKeysUp + currentKeys : currentKeys;
    if (input === "repassword") { repassword = currentKeysUp.value } else { password = currentKeysUp.value }

    if (repassword.length == 0) { console.log("waiting"); button.disabled = true; warningToggle(true, 'warning'); } else {
        if (password === repassword) {
            button.disabled = false;
            warningToggle(true, 'warning');
        } else {
            console.log("no");
            button.disabled = true;
            warningToggle(false, 'warning');
        }
    }
                
}

function warningToggle(status, popup) {
    const warning = document.querySelector(`.${popup}`);
    if(status){
        if(!warning.classList.contains('hide-warning')){
            warning.classList.add('hide-warning');
        }
    } else {
        if(warning.classList.contains('hide-warning')){
            warning.classList.remove('hide-warning');
        }
    }
}

listenForm = (formId) => {
    const form = document.querySelector(formId);
    const emailError = document.querySelector('.email.error');
    const passwordError = document.querySelector('.password.error');
    
    console.log(form);
    console.log(formId);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // reset errors
        emailError.textContent = '';
        passwordError.textContent = '';

        // get values
        const username = form.username.value;
        const email = form.email.value;
        const password = form.password.value;

        console.log(username, email, password);

        try {
            if (formId == "#signup-form") {
                const role = form.role.value;
                console.log(role);
                const res = await fetch('/signup', { 
                    method: 'POST', 
                    body: JSON.stringify({ username, email, password, role }),
                    headers: {'Content-Type': 'application/json'}
                });
                
                const data = await res.json();
                console.log(data);
                if (data.errors) {
                    emailError.textContent = data.errors.email;
                    passwordError.textContent = data.errors.password;
                }
                if (data.user) {
                    location.assign('/profile/' + data.user);
                }
            } else {
                const res = await fetch('/signin', { 
                method: 'POST', 
                body: JSON.stringify({ username, email, password }),
                headers: {'Content-Type': 'application/json'}
                });
                const data = await res.json();
                if (data.errors) {
                    emailError.textContent = data.errors.email;
                    passwordError.textContent = data.errors.password;
                }
                if (data.user) {
                    location.assign('/profile/' + data.user);
                }
            }
                
        }
        catch (err) {
            console.log(err);
        }
    });
}

listenEditProfile = () => {
    // edit profile form authentication method
    const editform = document.querySelector('#edit-profile-form');
    const imageDataError = document.querySelector('#image-data-error');
    const emailError = document.querySelector('#email-error');
    const passwordError = document.querySelector('#password-error');
    console.log(imageDataError, emailError, passwordError);

    editform.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // reset errors
        emailError.textContent = '';
        passwordError.textContent = '';
        imageDataError.textContent = '';

        // get values
        const img = editform.img;
        const username = editform.username.value;
        const email = editform.email.value;
        const password = editform.password.value;

        console.log(img);

        const formData = new FormData(editform);

        const URLencoded = new URLSearchParams(formData).toString();

        try {
            const res = await fetch('/profile/edit-profile', { 
                method: "PUT", 
                body: formData,
            });
            const data = await res.json();
            console.log(data);
            
            if (data.errors) {
                emailError.textContent = data.errors.email;
                passwordError.textContent = data.errors.password;
                imageDataError.textContent = data.errors.imageData;
                console.log(imageDataError, emailError, passwordError);
            }
            if (data.user) {
                location.assign('/profile/' + data.user);
            }

        }
        catch (err) {
            console.log(err);
        }
    });
};
