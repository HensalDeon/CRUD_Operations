function validateForm() {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const emailPattern = /^([a-zA-Z0-9\._]+)@([a-zA-Z0-9]+).([a-z]+).([a-z]+)?$/;

    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/;

    if (!emailPattern.test(emailInput.value)) {
        alert("Please enter a valid email address.");
        return false;
    }

    if (!passwordPattern.test(passwordInput.value)) {
        alert("Please enter a valid password");
        return false;
    }

    if (errors.length > 0) {
        // Display the error messages
        const errorContainer = document.getElementById("errorContainer");
        errorContainer.innerHTML = ""; // Clear previous errors

        errors.forEach((error) => {
            const errorElement = document.createElement("p");
            errorElement.textContent = error;
            errorContainer.appendChild(errorElement);
        });

        return false; // Prevent form submission
    }

    return true;
}
