import React, { Component } from 'react';

type formErrorPropsType = {
    disableEvent: boolean,
    errors: Array<strings>
};

/**
 * events:
 *    setFormErrors: detail = {errors: Array<string>, action: 'edit'|'new'}
 */
export default class FormErrors extends React.Component
{
    constructor(props: formErrorPropsType) {
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
            let k;
            const errorsList = [];
            for (k in this.state.errors) {
                const errorKey = 'form_error_' + this.props.action + '_' + k;
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
        if (!this.props.disableEvent) {
            document.addEventListener('setFormErrors', (event) => {
                if (event.detail.action === this.props.action) {
                    this.setState({errors: event.detail.errors});
                }
            });
        }
    }

}
