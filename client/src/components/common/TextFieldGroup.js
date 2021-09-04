import React from 'react'
import classnames from 'classnames';
import PropTypes from 'prop-types'

const TextFieldGroup = ({ name, placeholder, value, label, error, info, type, onChange,disabled}) => {
    return (

        <div className="input-group mb-3">
         <div className="input-group-prepend"></div>
         <span className="input-group-text">
         <i className={icon} />
         </span>

            <input className={classnames('form-control form-control-lg', {'is-invalid':error})} placeholder={placeholder} name={name} value = {value} onChange = {onChange} disabled={disabled} />
            {error && (<div className="invalid-feedback">{error}</div>)}
        </div>
    )
}

TextFieldGroup.propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    info: PropTypes.string,
    error: PropTypes.string,
    type: PropTypes.string.isRequired,
    onChange: PropTypes.string.isRequired,
    disabled: PropTypes.string
}

TextFieldGroup.defaultProps = {
    type: 'text'
}

export default TextFieldGroup;