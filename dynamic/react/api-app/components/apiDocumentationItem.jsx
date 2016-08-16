import React from 'react';
import ReactMarkdown from 'react-markdown';

import ApiDocumentationHeader from './apiDocumentationHeader';

const ApiDocumentationItem = ({documentationFor, name, item, isArray = false, nestingLevel, endpointId, displayName, isRoot = false}) => {
    if (item.fieldType && item.fieldType !== 'array') {
        return (
            <div className={'documentation-parameter-body'}>
                <div><div className={'api-doc-parameter-name s5'} title={displayName}>{displayName}</div>{item.required ? <div className='t2 small-required-text'>{'Required'}</div> : null}</div>
                <div className={'t1'}><ReactMarkdown source={item.description || ''} /></div>
                <div className={'t3'}>{`${isArray ? 'Array[' : ''}${item.fieldType}${isArray ? ']' : ''}`}</div>
            </div>
        );
    }

    if (item.fieldType === 'array') {
        return (
            <ApiDocumentationItem
                    displayName={displayName}
                    documentationFor={documentationFor}
                    endpointId={endpointId}
                    isArray={true}
                    isRoot={isRoot}
                    item={item.items}
                    name={`${name ? name + ':' : ''}items`}
                    nestingLevel={nestingLevel}
            />
        );
    }

    // Don't want root of 'try it out' to be collapseable!
    if (isRoot) {
        return (
            <div>
                {Object.keys(item).filter((n) => n !== 'required' && n !== 'isExcluded' && item[n]).map((itemKey, i) => {
                    return (
                        <ApiDocumentationItem
                            displayName={itemKey}
                            documentationFor={documentationFor}
                            endpointId={endpointId}
                            item={item[itemKey]}
                            itemName={itemKey}
                            key={i}
                            name={`${name ? name + ':' : ''}${itemKey}`}
                            nestingLevel={nestingLevel + 1}
                        />
                    );
                })}
            </div>
        );
    }

    return (
        <ApiDocumentationHeader displayName={displayName} documentationFor={documentationFor} endpointId={endpointId} isArray={isArray} nestingLevel={nestingLevel} propertyName={name}>
            {Object.keys(item).filter((n) => n !== 'required' && n !== 'isExcluded' && item[n]).map((itemKey, i) => {
                return (<ApiDocumentationItem
                    displayName={itemKey}
                    documentationFor={documentationFor}
                    endpointId={endpointId}
                    item={item[itemKey]}
                    itemName={itemKey}
                    key={i}
                    name={`${name ? name + ':' : ''}` + itemKey}
                    nestingLevel={nestingLevel + 1}
                />);
            })}
        </ApiDocumentationHeader>
    );
};

ApiDocumentationItem.displayName = 'Post Body Docs Item';
ApiDocumentationItem.propTypes = {
    displayName: React.PropTypes.string.isRequired,
    documentationFor: React.PropTypes.oneOf(['REQUEST', 'RESPONSE']),
    endpointId: React.PropTypes.number.isRequired,
    isArray: React.PropTypes.bool,
    isRoot: React.PropTypes.bool,
    item: React.PropTypes.object.isRequired,
    name: React.PropTypes.string.isRequired,
    nestingLevel: React.PropTypes.number.isRequired
};

export default ApiDocumentationItem;
