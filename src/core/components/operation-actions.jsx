import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import cx from "classnames"


export default class OperationActions extends PureComponent {
  static propTypes = {
    showClearBtn: PropTypes.bool,
    showExecuteBtn: PropTypes.bool,
    operation: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
    onExecute: PropTypes.func,
    getComponent: PropTypes.func.isRequired,
    specActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,      
  }

  render() {
    const {
      showClearBtn,
      showExecuteBtn,
      operation,
      specActions,
      specSelectors,
      path,
      method,
      onExecute,
      getComponent    
    } = this.props

    const Execute = getComponent("execute")
    const Clear = getComponent("clear")
 
    return (
     <div
       className={cx({
         "execute-wrapper": showExecuteBtn,
         "sui-btn-group sui-btn-group--tryitout": showClearBtn
       })}
     >
       { 
         showExecuteBtn &&
           <Execute
             operation={ operation }
             specActions={ specActions }
             specSelectors={ specSelectors }
             path={ path }
             method={ method }
             onExecute={ onExecute }
           />
       }
 
       { 
         showClearBtn &&
           <Clear
             specActions={ specActions }
             path={ path }
             method={ method }
           />
       }
     </div>
   )
  }
}