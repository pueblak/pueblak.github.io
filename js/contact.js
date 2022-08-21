function sendMessage() {
    if (getCookie("messageSent") != "") {
        alert("You have already sent a message within the last 30 minutes. "
              + "Please wait to send another.")
        return false;
    }

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
            SecureToken : "12422c68-7d67-44ef-9d3e-8ec8d0747602",
            To : "pueblakody@gmail.com",
            From : "noreply@kody-puebla.com",
            Subject : "Message from " + name,
            Body : ('<html><body><pre style="font-family: sans-serif;font-size: 1rem">'
                    + messageValue + "\n\nPlease reply to: " + sender + "</pre></body></html>")
        }).then(
            message => { if (message !== "OK") { 
                alert(message)
                return false
            } return true }
        ).then(
            success => { if (success) setCookie("messageSent", [name, sender, messageValue].join("$"), 1.0/48); return success}
        ).then(
            success => { if (success) Email.send({
                SecureToken : "5f0d9ca1-4e7f-48e2-927a-f5dbf9d05a94",
                To : sender,
                From : "noreply@kody-puebla.com",
                Subject : "Copy of Message from " + name,
                Body : ('<html><body><pre style="font-family: sans-serif;font-size: 1rem">'
                        + "Below is a copy of the message sent to pueblakody@gmail.com:\n"
                        + '\n<blockquote style="font-style: italic">' + messageValue + "\n\nPlease reply to: "
                        + sender + "</blockquote>\nIf you do not get a reply within "
                        + "48 hours, this may have ended up in my spam folder. Feel "
                        + "free to email me directly at "
                        + '<a href="mailto:pueblakody@gmail.com">pueblakody@gmail.com</a>.'
                        + "</pre></body></html>")
            }).then(
                message => {
                    if (message !== "OK") {
                        alert("The message was sent successfully to Kody, "
                              + "but there was an error when sending a copy "
                              + "to your email:\n\n" + message)
                    } else {
                        alert("Message sent successfully. A copy has been sent to your email.")
                    }
                }
            )}
        )
        for (let field of fields) {
            document.getElementById(field.id).value = ""
        }
    } else {
        document.getElementById('contact-form').addEventListener('submit', function(e){
            e.preventDefault()
        })
    }
    return valid
}