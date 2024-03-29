import React from 'react'
import classnames from 'classnames';
import PropTypes from 'prop-types'

const InputGroup = ({ name, placeholder, value  , error, icon, type, onChange}) => {
    return (
        <div className="form-group">
            <textarea className={classnames('form-control form-control-lg', {'is-invalid':error})} placeholder={placeholder} name={name} value = {value} onChange = {onChange} />
            {info && <small className="form-text text-muted">{info}</small>}
            {error && (<div className="invalid-feedback">{error}</div>)}
        </div>
    )
}

InputGroup.propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    icon: PropTypes.string,
    type: PropTypes.string.isRequired,
    error: PropTypes.string,
    onChange: PropTypes.string.isRequired,
}

InputGroup.defaultProps = {
    type: 'text'
}

export default InputGroup;