import PixelID from './PixelID'
import PixelAC from './PixelAC'

function Main(props) {
    if(props.page === 'pixelid') {
        return (<><main><PixelID access_code={props.access_token} /></main></>)
    } else if(props.page === 'pixelac') {
        return (<><main><PixelAC access_code={props.access_token} /></main></>)
    } else if(props.page === 'test3') {
        return (<><main>Hallo3</main></>)
    } else {
        return (<><main><PixelID access_code={props.access_token} /></main></>)
    }
}

export default Main