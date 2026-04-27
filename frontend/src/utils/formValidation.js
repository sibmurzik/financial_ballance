export class FormValidation {
    static password = '';
    static isValid ( value, type ) {
        if( type === "not_required" ) {
            return true;
        }
        if ( !value ) {
            return false;
        }
        let regEx = ""
        if ( type === 'email' ) {
            regEx = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        } else if ( type === 'password' ) {
            regEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&#]).{8,}$/ ;
        } else if ( type === 'name' ) {
            regEx = /^[А-ЯЁ][А-ЯЁ-яё\s]{2,}$/;
        } else if ( type === 'confirmPassword' ) {
            return value === this.password;
        }else if ( type === 'select' ) {
            return value !== "empty";
        }else if ( type === 'money' ) {
            regEx = /^[0-9]+$/;
        }else if ( type === 'date' ) {
            regEx = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19|20)\d\d$/;
        }
        return regEx.test( value );
    }

    static formFieldsValidation(fields) {

        if ( fields && fields.length > 0 ) {
            let validForm = true;
            for ( let i = 0; i < fields.length; i++) {
                if ( fields[i].inputType === "money" ) {
                    if ( fields[i].inputFiled.value.slice(-1) === "$" ) {
                        fields[i].inputFiled.value = fields[i].inputFiled.value.slice(0, -1);
                    }
                }

                if ( this.isValid(fields[i].inputFiled.value, fields[i].inputType) ) {
                    fields[i].inputFiled.classList.remove( "is-invalid" );
                    fields[i].inputFiled.classList.add( "is-valid" );
                    fields[i].validationFeedback.style.display = "none";
                    if (fields[i].inputType === "password" ) {
                       this.password =  fields[i].inputFiled.value
                    }
                    if ( fields[i].inputType === "money" ) {
                        fields[i].inputFiled.value =  fields[i].inputFiled.value + '$'
                    }
                }
                else {
                    fields[i].inputFiled.classList.remove( "is-valid" );
                    fields[i].inputFiled.classList.add( "is-invalid" );
                    fields[i].validationFeedback.style.display = "block";
                    validForm = false;
                }
            }
            return validForm;
        }
        return false;
    }


}