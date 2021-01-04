import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// @material-ui/core components
// @material-ui/icons
// import Warning from "@material-ui/icons/Warning";
// core components
import SnackbarContent from "components/Snackbar/SnackbarContent.js";

// sections for this page
import SectionPools from "features/vault/sections/SectionPools.js";
// import StakePage from 'features/stake/sections/StakePools.js';
// import FarmPools from 'features/farm/sections/FarmPools';
// style for this page
// resource file
// hooks

import CustomCarousel from "components/CustomCarousel/CustomCarousel.js";

export default function HomePage() {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);
  
  return (
    <>
      <SnackbarContent
        message={
            <span onClick={() => window.open(t('Home-SnackBarUrl'))} style={{fontWeight: "bold"}}>
              {t('Home-SnackBarText')}
            </span>
        }
        close
        color="success"
      />
      <CustomCarousel />
      <SectionPools />
    </>
  );
}