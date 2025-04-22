import React, { Component } from 'react';
import FormErrors from './formErrors';

type propsType = {
     message: string|null,
     oldFormValues: object|null, //object z session()->all()['_old_input']
     backendValidatorErrors: object|null //chyby formularu, automaticky vlozeno backendem
};

export default class FlashMessages extends React.Component
{
    constructor(props: propsType) {
        super(props);
    }

    render()
    {
	var errors = this.getMassagesFromBackendValidatorErrors(this.props.backendValidatorErrors);
        if (this.props.message !== null) {
            return this.printStatusMessage();
        } else if (errors.length > 0) {
            return this.printErrorMessages();
        } else {
            return null;
        }
    }

    printStatusMessage()
    {
        return (
            <div id="status_message">
                <p>{this.props.message}</p>
            </div>
        );
    }

    printErrorMessages()
    {
        var errors = this.getMassagesFromBackendValidatorErrors(this.props.backendValidatorErrors);
        switch (this.props.oldFormValues.action) {
            case 'edit':
                var errorTitle = `Editace astronauta ${this.props.oldFormValues.first_name} ${this.props.oldFormValues.last_name} se nepovedla`;
                break;
            case 'new':
                var errorTitle = 'Tvorba nového astronauta se nepovedla';
                break;
            default:
                var errorTitle = 'Něco se nepovedlo';
        }
        return (
            <div id="errorMessages">
                <p className="form_error">{errorTitle}</p>
                <FormErrors disableEvent={true} errors={errors} />
            </div>
        );
    }

    getMassagesFromBackendValidatorErrors(errors)
    {
        var massages = [];
        var k;
        for (k in errors) {
            massages.push(errors[k]);
        }

        return massages;
    }

}
