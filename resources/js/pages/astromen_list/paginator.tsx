import React, { Component } from 'react';
import {paginatorLinks} from './types';

type paginatorPropsType = {
    links: paginatorLinks
};

export default class Paginator extends React.Component
{
    constructor(props: paginatorPropsType) {
        super(props);
    }

    render()
    {
        var links = [];
		var linkKey = 1;
        this.props.links.forEach((linkRaw) => {
            let label = linkRaw.label.replace('&laquo;', '<').replace('&raquo;', '>');
			let classNames = [];
			if (linkRaw.active) {
				classNames.push('current_page');
			}
			if (linkRaw.url === null) {
				classNames.push('grey');
			}

			let linkKeyName = 'pagLink' + linkKey;
            if (linkRaw.url === null || linkRaw.active) {
                links.push(<span key={linkKeyName} className={classNames.join(' ')}>{label}</span>);
            } else {
                links.push(<a key={linkKeyName} className={classNames.join(' ')} href={linkRaw.url}>{label}</a>);
            }
			linkKey++;
        });

        return (
            <div className="paginator">
                {links}
            </div>
        );
    }

}
