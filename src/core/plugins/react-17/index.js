import { render } from "./root-injects"

const React17Plugin = ({ getSystem }) => {
    const { React } = getSystem()
    const rootInjects = {}

    if (React.version?.match(/^17/)) {
        rootInjects.render = render
    }

    return {
        rootInjects,
    }
}