import React from "react";
import OtherFIsScreen from "./dashboard/categories/OtherFIsScreen";
import {Container} from "@sencha/ext-react-modern";
import OtherHeader from "./dashboard/OtherHeader";
import {useTranslation} from "react-i18next";
import Loading from "../components/Loading";
import {connect} from "react-redux";

const Ext = window["Ext"];

const OtherDashboard = ({configuration}) => {
    const { t } = useTranslation();

    if (!configuration || configuration.processing) {
        return (
            <Container scrollable>
                <Loading/>
            </Container>
        )
    } else if (configuration.fail) {
        Ext.toast(t("ConfigurationCouldNotBeLoaded"));
    }

    return (
        <Container scrollable>
            <OtherHeader/>
            <OtherFIsScreen/>
        </Container>);
};

const mapStateToProps = (state) => ({
    configuration: state.configuration,
});

export default connect(mapStateToProps)(OtherDashboard);
