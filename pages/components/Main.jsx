import PixelID from './PixelID'
import PixelAC from './PixelAC'
import WhyUs from './WhyUs'
import Contact from './Contact'

function Main(props) {
    if(props.page === 'pixelid') {
        return (<><main><PixelID access_code={props.access_token} /></main></>)
    } else if(props.page === 'pixelac') {
        return (<><main><PixelAC access_code={props.access_token} /></main></>)
    } else if(props.page === 'whyus') {
        return (<><main><WhyUs /></main></>)
    } else if(props.page === 'contact') {
        return (<><main><Contact /></main></>)
    } else {
        return (<><main><PixelID access_code={props.access_token} /></main></>)
    }
}

export default Main