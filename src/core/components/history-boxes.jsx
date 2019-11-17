import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { timeAgo } from "core/utils"

export default class HistoryBoxes extends PureComponent {
    static propTypes = {
        operationId: PropTypes.string.isRequired, 
        hst: PropTypes.object,
        loadValuesFromLocalStorage: PropTypes.func,
        response: PropTypes.object
    }

    static defaultProps = {
        hst:  []
    }

    componentDidMount() {
        timeAgo(this.el)
    }

    componentDidUpdate() {
        timeAgo(this.el)
    }

    boxClick = (lsdata) => {
        let {loadValuesFromLocalStorage} = this.props
      
          loadValuesFromLocalStorage(lsdata.parameterValues)
    }


    render() {
        let { operationId, hst } = this.props

        var hstDivsFiltered = hst.filter(x => x.operationId == operationId)
        
        var hstDivs = hstDivsFiltered.map((lsdata, index) => {
            var res = lsdata.response
            var status= res.status
            var iconColor = "green"

            if (!status || status > 299 || status === "err") {
                iconColor = "red"
            }

            return <span key={index} className={iconColor +" hst-box"} onClick={() => this.boxClick(lsdata)}>
                <div className="timeAgoPopup">
                    <span className="timeago" title={lsdata.dateAdded}>{lsdata.dateAdded}</span> | <span>{lsdata.duration}ms</span> | <span>{status}</span>
                </div>
            </span>
        })

        if (!hstDivs || hstDivs.length === 0) return <div></div>

        return (
            <div>
                <h4 className="histBoxesTitle">History</h4>                
                    <div className="detailsHistoryList">
                        {hstDivs}
                    </div>               
            </div>
        )
    }
}
