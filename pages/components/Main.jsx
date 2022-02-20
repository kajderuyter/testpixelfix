import Pixel from './Pixel'
import WhyUs from './WhyUs'
import Contact from './Contact'
import Faq from './Faq'
import Info from './Info.jsx'

function Main(props) {
    if(props.page === 'pixel') {
        return (<><main><Pixel access_code={props.access_token} /></main></>)
    } else if(props.page === 'info') {
        return (<><main><Info access_code={props.access_token} /></main></>)
    } else if(props.page === 'whyus') {
        return (<><main><WhyUs /></main></>)
    } else if(props.page === 'contact') {
        return (<><main><Contact /></main></>)
    } else if(props.page === 'faq') {
        return (<><main><Faq /></main></>)
    } else {
        return (<><main><Pixel access_code={props.access_token} /></main></>)
    }
}

export default Main