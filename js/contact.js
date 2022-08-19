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
            SecureToken : "c7e92f8e-7da2-44cc-ac55-6ede8c42d168",
            To : "pueblakody@gmail.com",
            From : sender,
            Subject : "Message from " + name,
            Body : messageValue
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