function sendEmail() {
    const name = document.getElementById('name').value
    const sender = document.getElementById('email').value
    const messageValue = document.getElementById('message').value

    // Validate all fields in the form
    let valid = true
    const fields = [  // (id, validation function, error message)
        {
            'id': 'message',
            'validateFn': function(x){ return x != "" },
            'errorMessage': "Say something! I would love to hear from you!"
        },
        {
            'id': 'email',
            'validateFn': function(x){ return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(x) },
            'errorMessage': "Are you sure you entered this correctly?"
        },
        {
            'id': 'name',
            'validateFn': function(x){ return x != "" },
            'errorMessage': "How would you like me to address you?"
        }
    ]
    for (let field of fields) {
        if (field.validateFn(document.getElementById(field.id).value)) {
            if (document.getElementById(field.id).classList.contains("input-error")) {
                document.getElementById(field.id).classList.remove("input-error")
                document.getElementById(field.id).classList.add("input-valid")
            }
            document.getElementById(field.id + '-error').innerHTML = ""
        } else {
            if (document.getElementById(field.id).classList.contains("input-valid")) {
                document.getElementById(field.id).classList.remove("input-valid")
                document.getElementById(field.id).classList.add("input-error")
            }
            document.getElementById(field.id + '-error').innerHTML = field.errorMessage
            document.getElementById(field.id).focus()
            valid = false
        }
    }

    if (valid) {
        Email.send({
            SecureToken : "905bc4dc-64b3-4918-aeb5-0e9d22d443c8",
            To : "guest@kody-puebla.com",
            From : "guest@kody-puebla.com",
            Subject : "Message from " + name,
            Body : messageValue + "\n- " + sender
        }).then(
            message => alert(message)
        )
    } else {
        document.getElementById('contact-form').addEventListener('submit', function(e){
            e.preventDefault()
        })
    }
    return valid
}