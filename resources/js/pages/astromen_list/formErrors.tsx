import React, { Component } from 'react';

export default class FormErrors extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            errors: props.errors
        };
    }

    render()
    {
        if (this.state.errors.length === 0) {
            return (
                <div id="form_errors">
                </div>
            );
        } else {
            var k;
            var errorsList = [];
            for (k in this.state.errors) {
                let errorKey = 'form_error_' + this.props.action + '_' + k;
                errorsList.push(<li key={errorKey}>{this.state.errors[k]}</li>);
            }
            
            return (
                <div id="form_errors">
                    <ul className="form_errors">
                        {errorsList}
                    </ul>
                </div>
            );
        }
    }
    
    componentDidMount()
    {
        var toto = this;
        if (!this.props.disableEvent) {
            document.addEventListener('setFormErrors', function(event) {
                if (event.detail.action === toto.props.action) {
                    toto.setState({errors: event.detail.errors});
                }
            });
        }
    }
    
}
