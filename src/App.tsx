import React, { useState } from "react";
import "./App.css";
import { LocationPicker } from "./location-picker/LocationPicker";
import { TodayLocationsSection } from "./today-locations/TodayLocationsSection";
import CookiesBar from "./Cookies";
import BookingModal from "./calendar/modal/CalendarModal";
import { Switch, Route } from "react-router-dom";
import { useBookingData } from "./calendar/booking/BookingData";
import { LocationRouter } from "./LocationRouter";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Banner } from "./Banner";
import {
  HealthpointLocationsContext,
  HealthpointLocationsResult,
} from "./contexts";
import { HomePage } from "./HomePage";
import { useSaveScroll } from "./scroll";
import { Helmet } from "react-helmet";

const Contexts: React.FC<{}> = (props) => {
  const [healthpointLocations, setHealthpointLocations] =
    useState<HealthpointLocationsResult>({ loading: true });

  return (
    <HealthpointLocationsContext.Provider
      value={{
        value: healthpointLocations,
        setValue: setHealthpointLocations,
      }}
    >
      {props.children}
    </HealthpointLocationsContext.Provider>
  );
};

function getCanonicalHome() {
  const { protocol, host } = window.location;
  const searchParams = new URL(window.location.toString()).searchParams;
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const placeName = searchParams.get("placeName");
  const radius = searchParams.get("radius");

  const canonicalDict = {
    ...(lat ? { lat } : {}),
    ...(lng ? { lng } : {}),
    ...(placeName ? { placeName } : {}),
    ...(radius ? { radius } : {}),
  };

  // todo: put pathname too
  const sp = new URLSearchParams(canonicalDict).toString();
  const canonical = `${protocol}//${host}${sp ? `?${sp}` : ""}`;
  console.log("canonical", canonical);
  return canonical;
}

function getCanonicalLocations() {
  const { protocol, host, pathname } = window.location;
  // const searchParams = new URL(window.location.toString()).searchParams;
  // const lat = searchParams.get("lat");
  // const lng = searchParams.get("lng");
  // const placeName = searchParams.get("placeName");
  // const radius = searchParams.get("radius");

  const canonicalDict = {
    // ...(lat ? { lat } : {}),
    // ...(lng ? { lng } : {}),
    // ...(placeName ? { placeName } : {}),
    // ...(radius ? { radius } : {}),
  };

  // todo: put pathname too
  const sp = new URLSearchParams(canonicalDict).toString();
  const canonical = `${protocol}//${host}${pathname}${sp ? `?${sp}` : ""}`;
  console.log("canonical", canonical);
  return canonical;
}

function App() {
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null); // null whilst loading
  const bookingData = useBookingData(setLastUpdateTime);
  useSaveScroll();

  return (
    <Contexts>
      <div className="App">
        <Header />
        <Switch>
          <Route path="/bookings/:date">
            <div className={"big-old-container"}>
              <BookingModal
                bookingData={"ok" in bookingData ? bookingData.ok : undefined}
              />
            </div>
          </Route>
          <Route path="/locations/:slug">
            <Helmet>
              <title>
                {/* TODO: dynamic */}
                The Auckland City Doctors | Walk-in/Drive-through vaccination
                site | Vaxx.nz
              </title>
              <link rel="canonical" href={getCanonicalLocations()} />
            </Helmet>
            <div className={"big-old-container"}>
              <LocationRouter />
              <TodayLocationsSection />
            </div>
          </Route>
          <Route>
            <>
              <Helmet>
                <title>
                  Find a COVID vaccination in New Zealand | Vaccine finder New
                  Zealand | See ways to get vaccinated near you | Vaxx.nz
                </title>
                <link rel="canonical" href={getCanonicalHome()} />
              </Helmet>
              <Banner />
              <div className={"big-old-container"}>
                <LocationPicker lastUpdateTime={lastUpdateTime} />
                <HomePage bookingData={bookingData} />
              </div>
            </>
          </Route>
        </Switch>
        <Footer />
      </div>
      <div className="background">
        <div
          className="bg-impt"
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL + "/bg.svg"})`,
          }}
        ></div>
        <CookiesBar />
      </div>
    </Contexts>
  );
}

export default App;
