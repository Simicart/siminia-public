import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { render, unmountComponentAtNode } from 'react-dom'

require('./confirmAlert.scss')

export default class ReactConfirmAlert extends Component {
    static propTypes = {
        title: PropTypes.string,
        message: PropTypes.string,
        buttons: PropTypes.array.isRequired,
        childrenElement: PropTypes.func,
        customUI: PropTypes.func,
        closeOnClickOutside: PropTypes.bool,
        closeOnEscape: PropTypes.bool,
        showCloseButton: PropTypes.bool,
        willUnmount: PropTypes.func,
        afterClose: PropTypes.func,
        onClickOutside: PropTypes.func,
        onKeypressEscape: PropTypes.func
    }

    static defaultProps = {
        buttons: [
            {
                label: 'Cancel',
                onClick: () => null,
                className: null
            },
            {
                label: 'Confirm',
                onClick: () => null,
                className: null
            }
        ],
        childrenElement: () => null,
        closeOnClickOutside: true,
        closeOnEscape: true,
        showCloseButton: true,
        willUnmount: () => null,
        afterClose: () => null,
        onClickOutside: () => null,
        onKeypressEscape: () => null,
    }

    handleClickButton = button => {
        if (button.onClick) button.onClick()
        this.close()
    }

    handleClickOverlay = e => {
        const { closeOnClickOutside, onClickOutside } = this.props
        const isClickOutside = e.target === this.overlay

        if (closeOnClickOutside && isClickOutside) {
            onClickOutside()
            this.close()
        }
    }

    close = () => {
        const { afterClose } = this.props
        removeBodyClass()
        removeElementReconfirm()
        removeSVGBlurReconfirm(afterClose)
    }

    keyboardClose = event => {
        const { closeOnEscape, onKeypressEscape } = this.props
        const isKeyCodeEscape = event.keyCode === 27

        if (closeOnEscape && isKeyCodeEscape) {
            onKeypressEscape(event)
            this.close()
        }
    }

    componentDidMount = () => {
        document.addEventListener('keydown', this.keyboardClose, false)
    }

    componentWillUnmount = () => {
        document.removeEventListener('keydown', this.keyboardClose, false)
        this.props.willUnmount()
    }

    renderCustomUI = () => {
        const { title, message, buttons, customUI } = this.props
        const dataCustomUI = {
            title,
            message,
            buttons,
            onClose: this.close
        }

        return customUI(dataCustomUI)
    }

    render() {
        const { title, message, buttons, childrenElement, customUI, className, showCloseButton } = this.props

        return (
            <div
                role="presentation"
                className='siminia-react-confirm-alert-overlay'
                ref={dom => (this.overlay = dom)}
                onClick={this.handleClickOverlay}
            >
                <div className={`siminia-react-confirm-alert ${className ? className : ''}`}>
                    {customUI ? (
                        this.renderCustomUI()
                    ) : (
                            <div className='siminia-react-confirm-alert-body'>
                                {
                                    showCloseButton ? <div className='siminia-react-confirm-alert-close'>
                                        <i className="icon-cross" role="presentation" onClick={this.close} />
                                    </div> : ''
                                }
                                {title && <h2>{title}</h2>}
                                <h3>{message}</h3>
                                {childrenElement()}
                                <div className='siminia-react-confirm-alert-button-group'>
                                    {buttons.map((button, i) => (
                                        <button key={i} onClick={() => this.handleClickButton(button)} className={button.className}>
                                            {button.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                </div>
            </div>
        )
    }
}

function createSVGBlurReconfirm() {
    // If has svg ignore to create the svg
    const svg = document.getElementById('siminia-react-confirm-alert-firm-svg')
    if (svg) return
    const svgNS = 'http://www.w3.org/2000/svg'
    const feGaussianBlur = document.createElementNS(svgNS, 'feGaussianBlur')
    feGaussianBlur.setAttribute('stdDeviation', '0.3')

    const filter = document.createElementNS(svgNS, 'filter')
    filter.setAttribute('id', 'gaussian-blur')
    filter.appendChild(feGaussianBlur)

    const svgElem = document.createElementNS(svgNS, 'svg')
    svgElem.setAttribute('id', 'siminia-react-confirm-alert-firm-svg')
    svgElem.setAttribute('class', 'siminia-react-confirm-alert-svg')
    svgElem.appendChild(filter)

    document.body.appendChild(svgElem)
}

function removeSVGBlurReconfirm(afterClose) {
    const svg = document.getElementById('siminia-react-confirm-alert-firm-svg')
    svg.parentNode.removeChild(svg)
    document.body.children[0].classList.remove('siminia-react-confirm-alert-blur')
    afterClose()
}

function createElementReconfirm(properties) {
    let divTarget = document.getElementById('siminia-react-confirm-alert')
    if (divTarget) {
        // Rerender - the mounted ReactConfirmAlert
        render(<ReactConfirmAlert {...properties} />, divTarget)
    } else {
        // Mount the ReactConfirmAlert component
        document.body.children[0].classList.add('siminia-react-confirm-alert-blur')
        divTarget = document.createElement('div')
        divTarget.id = 'siminia-react-confirm-alert'
        document.body.appendChild(divTarget)
        render(<ReactConfirmAlert {...properties} />, divTarget)
    }
}

function removeElementReconfirm() {
    const target = document.getElementById('siminia-react-confirm-alert')
    if (target) {
        unmountComponentAtNode(target)
        target.parentNode.removeChild(target)
    }
}

function addBodyClass() {
    document.body.classList.add('siminia-react-confirm-alert-body-element')
}

function removeBodyClass() {
    document.body.classList.remove('siminia-react-confirm-alert-body-element')
}

export function confirmAlert(properties) {
    addBodyClass()
    createSVGBlurReconfirm()
    createElementReconfirm(properties)
}