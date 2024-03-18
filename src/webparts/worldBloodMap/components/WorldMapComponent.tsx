import * as React from 'react';
import { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Graticule } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import './WorldMapComponent.module.scss'; // Assuming you've created this SCSS file
import styles from './WorldMapComponent.module.scss';

const geoUrl = "https://raw.githubusercontent.com/Christian-TechUCM/WorldMap/main/features.json";

interface CountryData {
    Country: string;
    Population: number;
    "O+": number;
    "A+": number;
    "B+": number;
    "AB+": number;
    "O-": number;
    "A-": number;
    "B-": number;
    "AB-": number;
  }
  
  const Tooltip: React.FC<{ content: string, x: number, y: number }> = ({ content, x, y }) => (
    <div
      className={`${styles.tooltip} ${content ? styles.visible : ''}`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      {content}
    </div>
  );
  
  const WorldMapComponent: React.FC = () => {
    const [countriesData, setCountriesData] = useState<CountryData[]>([]);
    const [tooltipContent, setTooltipContent] = useState<string>('');
    const [tooltipPosition, setTooltipPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('https://sharepointapi-0026b69b2966.herokuapp.com/api/bloodtypes');
          const data: CountryData[] = await response.json();
          setCountriesData(data);
        } catch (error) {
          console.error("Error fetching country data:", error);
        }
      };
      fetchData();
    }, []);
  
    // Assuming population data is sufficiently spread, adjust domain for more granularity if needed
  const populationExtent = countriesData.length > 0 ? [Math.min(...countriesData.map(d => d.Population)), Math.max(...countriesData.map(d => d.Population))] : [0, 1];
  const colorScale = scaleLinear<string>()
    .domain(populationExtent)
    .range(["#ff5f5f", "#8b0000"]);
    return (
      <>
        {tooltipContent && <Tooltip content={tooltipContent} x={tooltipPosition.x} y={tooltipPosition.y} />}
        <ComposableMap projectionConfig={{ scale: 145 }}>
          <Graticule stroke="#c3c4c3" />
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => {
                const countryData = countriesData.find(c => c.Country === geo.properties.name);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={countryData ? colorScale(countryData.Population) : "#E2E2E2"}
                    onMouseEnter={(evt) => {
                      const x = evt.clientX + 10; // Adjust for slight offset from cursor
                      const y = evt.clientY + 10;
                      const data = countryData ?
                        `${countryData.Country}: Population: ${countryData.Population}
                        \nBlood Types: O+: ${countryData["O+"]}%, A+: ${countryData["A+"]}%, B+: ${countryData["B+"]}%, AB+: ${countryData["AB+"]}%, O-: ${countryData["O-"]}%, A-: ${countryData["A-"]}%, B-: ${countryData["B-"]}%, AB-: ${countryData["AB-"]}%`
                        :
                        'No data available';
                      setTooltipContent(data);
                      setTooltipPosition({ x, y });
                    }}
                    onMouseMove={(evt) => {
                      const x = evt.clientX + 10; // Adjust for slight offset from cursor
                      const y = evt.clientY + 10;
                      setTooltipPosition({ x, y });
                    }}
                    onMouseLeave={() => {
                      setTooltipContent('');
                    }}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#F53", outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </>
    );
  };
  
  export default WorldMapComponent;