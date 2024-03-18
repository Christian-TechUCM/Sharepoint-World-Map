import * as React from "react";
import styles from "./WorldBloodMap.module.scss";

import { IWorldBloodMapProps } from "./IWorldBloodMapProps";
import WorldMapComponent from "./WorldMapComponent"; // Adjust the import path as needed

export default class WorldBloodMap extends React.Component<
  IWorldBloodMapProps,
  {}
> {
  public render(): React.ReactElement<IWorldBloodMapProps> {
    const { hasTeamsContext } = this.props;

    return (
      <section
        className={`${styles.worldBloodMap} ${
          hasTeamsContext ? styles.teams : ""
        }`}
      >
        <div className={styles.welcome}>
          <h1>Welcome to the World Blood Map</h1>
        </div>

        <div className={styles.mapContainer}>
          <WorldMapComponent />
        </div>
      </section>
    );
  }
}
