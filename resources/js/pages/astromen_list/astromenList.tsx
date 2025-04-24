import React, { Component } from 'react';
import Paginator from './paginator';
import {astromen, astromenRow} from './types';

type astromenListPropsType = {
    list: astromen,
    paginator: object //z Illuminate\Pagination\LengthAwarePaginator
};

export default class AstromenList extends React.Component
{
    constructor(props: astromenListPropsType)
    {
        super(props);
    }

    render()
    {
        if (this.props.list.length === 0) {
            return (
                <div id="status_message">
                    <p>Žádný astronaut zatím nevzniknul.</p>
                </div>
            );
        }

        const rows = [];
        let k;
        for (k in this.props.list) {
            const row = this.props.list[k];
            rows.push(<AstromenListRow key={k} rowNumber={k} rowData={row} />);
        }

        return (
            <>
                <table id="atromen_table" className="normTab">
                    <thead>
                        <tr>
                            <th>Jméno</th>
                            <th>Příjmení</th>
                            <th>Datum narození</th>
                            <th>Dovednosti</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
                <Paginator links={this.props.paginator.links} />
            </>
        );
    }

}

type astromenListRowPropsType = {
    rowNumber: number
    rowData: astromenRow
};

/**
 * events:
 *    unmarkRow
 */
class AstromenListRow extends React.Component
{
    constructor(props: astromenListRowPropsType)
    {
        super(props);
        this.state = {
            markedForEdit: false,
            markedForDelete: false
        };
    }

    render()
    {
        if (this.state.markedForEdit) {
            var markedClassName = 'marked_edit';
        } else if (this.state.markedForDelete) {
            var markedClassName = 'marked_delete';
        } else {
            var markedClassName = '';
        }

        return (
            <>
                <tr className={markedClassName}>
                    <td>{this.props.rowData.first_name}</td>
                    <td>{this.props.rowData.last_name}</td>
                    <td>{this.props.rowData.dobCz}</td>
                    <td>{this.props.rowData.skill_names.join(', ')}</td>
                    <td>
                    <button type="button" data-id={this.props.rowNumber} onClick={() => {this.astromanEdited();}}>Editovat</button>
                    <button type="button" data-id={this.props.rowNumber} onClick={() => {this.astromanDeleted();}}>Smazat</button>
                    </td>
                </tr>
            </>
        );
    }

    componentDidMount()
    {
        document.addEventListener('unmarkRow', () => {
            this.setState({
                markedForEdit: false,
                markedForDelete: false
            });
        });
    }

    astromanEdited()
    {
        this.unmarkRows();
        this.setState({markedForEdit: true});
        const formEvent = new CustomEvent('astromanFormEditSetData', {detail:{data: this.props.rowData}});
        document.dispatchEvent(formEvent);
        const hideDeleteAstromanFormEvent = new CustomEvent('hideDeleteAstromanForm');
        document.dispatchEvent(hideDeleteAstromanFormEvent);
    }

    astromanDeleted()
    {
        this.unmarkRows();
        this.setState({markedForDelete: true});
        const hideNewAstromanAndEditFormEvent = new CustomEvent('hideNewAstromanAndEditForm');
        document.dispatchEvent(hideNewAstromanAndEditFormEvent);
        const formEvent = new CustomEvent('astromanFormDeleteSetData', {detail:{data: this.props.rowData}});
        document.dispatchEvent(formEvent);
    }

    unmarkRows()
    {
        const unmarkRowEvent = new CustomEvent('unmarkRow');
        document.dispatchEvent(unmarkRowEvent);
    }

}
