import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import loadable from '@loadable/component';

// Import SectionBuilder and SectionCustom components
import SectionBuilder from '../PageBuilder/SectionBuilder/SectionBuilder';
import SectionCustom from '../PageBuilder/SectionBuilder/SectionCustom';
import FallbackPage from './FallbackPage';
import { camelize } from '../../util/string';
import { ASSET_NAME } from './LandingPage.duck';

const PageBuilder = loadable(() =>
  import(/* webpackChunkName: "PageBuilder" */ '../PageBuilder/PageBuilder')
);

export const LandingPageComponent = (props) => {
  const { pageAssetsData, inProgress, error } = props;

  // Get the existing page data
  const pageData = pageAssetsData?.[camelize(ASSET_NAME)]?.data;

  return (
    <PageBuilder
      pageAssetsData={pageData}
      options={props.options}
      inProgress={inProgress}
      error={error}
      fallbackPage={<FallbackPage error={error} />}
    >
      {/* Render all sections from the CMS */}
      <SectionBuilder sections={pageData?.sections} options={props.options} />

      {/* Render the custom section after the CMS content */}
      <SectionCustom />
    </PageBuilder>
  );
};

const mapStateToProps = (state) => {
  const { pageAssetsData, inProgress, error } = state.hostedAssets || {};
  return { pageAssetsData, inProgress, error };
};

const LandingPage = compose(connect(mapStateToProps))(LandingPageComponent);

export default LandingPage;
