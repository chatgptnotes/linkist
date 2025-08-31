document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const fullNameInput = document.getElementById('fullName');
    const genderSelect = document.getElementById('gender');
    const ageInput = document.getElementById('age');
    const countryCodeSelect = document.getElementById('countryCode');
    const mobileInput = document.getElementById('mobile');
    const cityInput = document.getElementById('city');
    const consentCheckbox = document.getElementById('consent');
    const submitBtn = document.querySelector('.submit-btn');
    const successMessage = document.getElementById('successMessage');

    // Update mobile number help text based on selected country code and input
    function updateMobileHelp() {
        const countryCode = countryCodeSelect.value;
        const mobileNumber = mobileInput.value;
        const helpText = document.querySelector('.form-group:has(#mobile) .help-text');
        const digitCount = mobileNumber.length;
        helpText.textContent = `Complete number: ${countryCode} (${digitCount}/12 digits)`;
    }

    // Mobile number input restrictions and formatting
    mobileInput.addEventListener('input', function(e) {
        // Remove any non-digit characters
        let value = e.target.value.replace(/\D/g, '');
        
        // Limit to 12 digits
        if (value.length > 12) {
            value = value.slice(0, 12);
        }
        
        e.target.value = value;
        updateMobileHelp();
        validateMobile();
    });

    // Update help text when country code changes
    countryCodeSelect.addEventListener('change', function() {
        updateMobileHelp();
        validateMobile();
    });

    // Age input validation
    ageInput.addEventListener('input', function(e) {
        let value = e.target.value;
        
        // Remove any non-digit characters
        value = value.replace(/\D/g, '');
        
        // Limit to 2 digits and ensure it's between 18-99
        if (value.length > 2) {
            value = value.slice(0, 2);
        }
        
        if (value && (parseInt(value) < 18 || parseInt(value) > 99)) {
            if (parseInt(value) < 18) {
                value = '18';
            } else if (parseInt(value) > 99) {
                value = '99';
            }
        }
        
        e.target.value = value;
        validateAge();
    });

    // Real-time validation functions
    function validateFullName() {
        const name = fullNameInput.value.trim();
        const nameGroup = fullNameInput.closest('.form-group');
        const errorElement = document.getElementById('nameError');
        
        if (name.length < 2) {
            showError(nameGroup, errorElement, 'Full name must be at least 2 characters long');
            return false;
        } else if (!/^[a-zA-Z\s]+$/.test(name)) {
            showError(nameGroup, errorElement, 'Full name can only contain letters and spaces');
            return false;
        } else {
            clearError(nameGroup, errorElement);
            return true;
        }
    }

    function validateGender() {
        const gender = genderSelect.value;
        const genderGroup = genderSelect.closest('.form-group');
        const errorElement = document.getElementById('genderError');
        
        if (!gender) {
            showError(genderGroup, errorElement, 'Please select your gender');
            return false;
        } else {
            clearError(genderGroup, errorElement);
            return true;
        }
    }

    function validateAge() {
        const age = parseInt(ageInput.value);
        const ageGroup = ageInput.closest('.form-group');
        const errorElement = document.getElementById('ageError');
        
        if (!age) {
            showError(ageGroup, errorElement, 'Age is required');
            return false;
        } else if (age < 18 || age > 99) {
            showError(ageGroup, errorElement, 'Age must be between 18-99 years');
            return false;
        } else {
            clearError(ageGroup, errorElement);
            return true;
        }
    }

    function validateMobile() {
        const mobile = mobileInput.value;
        const mobileGroup = mobileInput.closest('.form-group');
        const errorElement = document.getElementById('mobileError');
        
        if (!mobile) {
            showError(mobileGroup, errorElement, 'Mobile number is required');
            return false;
        } else if (mobile.length < 6) {
            showError(mobileGroup, errorElement, 'Mobile number must be at least 6 digits');
            return false;
        } else if (mobile.length > 12) {
            showError(mobileGroup, errorElement, 'Mobile number cannot exceed 12 digits');
            return false;
        } else if (!/^\d+$/.test(mobile)) {
            showError(mobileGroup, errorElement, 'Mobile number can only contain digits');
            return false;
        } else {
            clearError(mobileGroup, errorElement);
            return true;
        }
    }

    function validateCity() {
        const city = cityInput.value.trim();
        const cityGroup = cityInput.closest('.form-group');
        const errorElement = document.getElementById('cityError');
        
        if (city.length < 2) {
            showError(cityGroup, errorElement, 'City name must be at least 2 characters long');
            return false;
        } else if (!/^[a-zA-Z\s]+$/.test(city)) {
            showError(cityGroup, errorElement, 'City name can only contain letters and spaces');
            return false;
        } else {
            clearError(cityGroup, errorElement);
            return true;
        }
    }

    function validateConsent() {
        const consentGroup = consentCheckbox.closest('.form-group');
        const errorElement = document.getElementById('consentError');
        
        if (!consentCheckbox.checked) {
            if (!errorElement) {
                const newErrorElement = document.createElement('span');
                newErrorElement.id = 'consentError';
                newErrorElement.className = 'error-message';
                consentGroup.appendChild(newErrorElement);
            }
            showError(consentGroup, document.getElementById('consentError'), 'You must consent to data processing to register');
            return false;
        } else {
            clearError(consentGroup, document.getElementById('consentError'));
            return true;
        }
    }

    function showError(group, errorElement, message) {
        group.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    function clearError(group, errorElement) {
        group.classList.remove('error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    // Add real-time validation listeners
    fullNameInput.addEventListener('blur', validateFullName);
    fullNameInput.addEventListener('input', validateFullName);
    genderSelect.addEventListener('change', validateGender);
    ageInput.addEventListener('blur', validateAge);
    mobileInput.addEventListener('blur', validateMobile);
    cityInput.addEventListener('blur', validateCity);
    cityInput.addEventListener('input', validateCity);
    consentCheckbox.addEventListener('change', validateConsent);

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        const isNameValid = validateFullName();
        const isGenderValid = validateGender();
        const isAgeValid = validateAge();
        const isMobileValid = validateMobile();
        const isCityValid = validateCity();
        const isConsentValid = validateConsent();
        
        if (isNameValid && isGenderValid && isAgeValid && isMobileValid && isCityValid && isConsentValid) {
            // Simulate form submission
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" stroke-dasharray="31.416" stroke-dashoffset="31.416"><animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/><animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/></circle></svg>Processing...';
            
            setTimeout(function() {
                form.style.display = 'none';
                successMessage.style.display = 'block';
                
                // Log form data
                const formData = {
                    fullName: fullNameInput.value,
                    gender: genderSelect.value,
                    age: ageInput.value,
                    countryCode: countryCodeSelect.value,
                    mobile: mobileInput.value,
                    city: cityInput.value,
                    consent: consentCheckbox.checked
                };
                
                console.log('Form submitted with data:', formData);
            }, 2000);
        } else {
            // Scroll to first error
            const firstError = document.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    // Initialize mobile help text
    updateMobileHelp();
    
    // Add error message elements that don't exist in HTML
    const errorIds = ['nameError', 'genderError', 'ageError', 'mobileError', 'cityError'];
    errorIds.forEach(id => {
        if (!document.getElementById(id)) {
            const errorElement = document.createElement('span');
            errorElement.id = id;
            errorElement.className = 'error-message';
            errorElement.style.display = 'none';
            
            const fieldId = id.replace('Error', '');
            const field = document.getElementById(fieldId);
            if (field) {
                field.closest('.form-group').appendChild(errorElement);
            }
        }
    });
});