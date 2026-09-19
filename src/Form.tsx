import {qualtricsUrl} from './site';
export default function ObservationForm(){return <>
 <p className="eyebrow">Share an observation</p>
 {qualtricsUrl?<><h1 className="survey-title">Your listening note.</h1><a className="textlink" href={qualtricsUrl} target="_blank" rel="noopener noreferrer">Open form in a new tab ↗</a>
 <iframe className="survey-frame" src={qualtricsUrl} title="Campus Sound Notes observation form" allow={`geolocation ${new URL(qualtricsUrl).origin}`} referrerPolicy="strict-origin-when-cross-origin"/>
 </>:<section className="survey-unavailable section" role="status"><h2>The observation form is being prepared.</h2><p className="section-sm">Please check back soon. You can explore the map in the meantime.</p><a className="button secondary section" href="#/explore">Explore the map →</a></section>}
 <p className="small section-sm">Map updated periodically.</p><a className="textlink" href="#/privacy">Privacy & your data →</a></>;}
