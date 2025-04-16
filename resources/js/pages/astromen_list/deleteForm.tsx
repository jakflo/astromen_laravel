import React, { Component } from 'react';

export default class DeleteForm extends React.Component
{
    constructor(props) 
    {
        super(props);
            this.state = {
                show: false, 
                data: {
                    first_name: '', 
                    last_name: '', 
                    id: 0
                }
            };
    }
    
    render()
    {
        if (!this.state.show) {
            return (
                <>
                </>
            );
        }
        
        var deleteAstromanTitle = `Skutečně si přejete vymazat astronauta ${this.state.data.first_name} ${this.state.data.last_name}?`;
        return (
            <>
                <h1>{deleteAstromanTitle}</h1>
                <form action="/delete" method="POST">
                    <input type="hidden" name="_method" value="DELETE" />
                    <input type="hidden" name="_token" value={this.props.csrf} />
                    <input type="hidden" name="id" value={this.state.data.id} />
                    <input type="hidden" name="action" value='delete' />
                    <input type="submit" name="sent" value="Ano" />
                    <button type="button" onClick={() => {this.cancel();}}>Ne</button>
                </form>
            </>
        );
    }
    
    componentDidMount()
    {
        var toto = this;
        document.addEventListener('astromanFormDeleteSetData', function(event) {
            toto.setState({data: event.detail.data, show: true});
        });
    }
    
    cancel()
    {
        var setFormErrorsEvent = new CustomEvent('unmarkRow');
        document.dispatchEvent(setFormErrorsEvent);
        this.setState({show: false});
    }
    
}
