import Validator from 'validator';

export default class AddOrEditFormValidator
{
    _errors;
    
    async validate(formObject)
    {
        this._errors = [];
        this
                ._validateNames(formObject.first_name.value, 'Jméno')
                ._validateNames(formObject.last_name.value, 'Příjmení')
                ._validateDate(formObject.DOB.value, 'Datum narození');
        var e = await this._validateAstromanNotUsed(formObject.id.value, formObject.first_name.value, formObject.last_name.value, formObject.DOB.value);
		console.log('sss');console.log(this._errors);
        return this._errors;
    }
    
    _validateNames(value, fieldName)
    {
        if (Validator.isEmpty(value, {ignore_whitespace: true})) {
            this._errors.push(fieldName + ' nesmí být prázdné');
        } else if (value.length > 32) {
            this._errors.push(fieldName + ' nesmí být delší, než 32 znaků');
        }
        
        return this;
    }
    
    _validateDate(value, fieldName)
    {
        if (!Validator.isDate(value, {format:'YYYY-MM-DD', delimiters: ['-']})) {
            this._errors.push(fieldName + ' je neplatné')
        }
        
        return this;
    }
    
    async _validateAstromanNotUsed(id, firstName, lastName, dob)
    {
	var params = new URLSearchParams({
            id: id, 
            first_name: firstName, 
            last_name: lastName, 
            dob: dob
	});
        
        var responseRaw = await fetch(
            '/astroman_exists?' + params.toString(), 
            {method: 'get'}
        );

        var response = await responseRaw.json();
		if (response.response == 1) {
		this._errors.push('Astronaut již existuje');
		}
    }
    
}