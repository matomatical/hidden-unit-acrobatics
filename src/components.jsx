import React from 'react';
import { Mafs, Coordinates, Point, Plot, useMovablePoint } from 'mafs';


// typesetting components


export function ExampleBox({ name, children }) {
    const style = {
        padding: "0 1em",
        background: "var(--back2)",
        border: "1px solid var(--text2)",
        borderRadius: "5px",
    };
    return <div style={style}><h3>{name}</h3>{children}</div>;
}


export function Center({ children }) {
    const style = {
        textAlign: "center",
    };
    return <div style={style}>{children}</div>;
}


// FULL INTERACTIVE APP

    
const initialNetwork = {
    units: [unit(0.7,1,1), unit(-0.5,1,-1), unit(0,0,0), unit(0.1,0,1)],
    bias:  0.2,
}


const initialNetworkUnbiased = {
    units: [//  a     b     c
        unit(  1.0,  1.0,  0.0),
        unit( -1.0,  0.5,  0.0),
        unit(  0.6,  1.0,  0.0),
    ],
    bias:  0.0,
}


export function AppInteractive({ biased }) {
    let net0 = biased ? initialNetwork : initialNetworkUnbiased;
    const [network, setNetwork] = React.useState(net0);
    return (<>
        <NetworkControl
            biased={biased}
            network={network}
            setNetwork={setNetwork}
        />
        <NetworkGraph
            biased={biased}
            network={network}
        />
        <NetworkFunction
            biased={biased}
            network={network}
        />
        {/*<NetworkUnits network={network} />*/}
    </>);
}


export function NetworkControl({ biased, network, setNetwork }) {
    function updateUnit(unit, component, newValue) {
        setNetwork(network => {
            let newNetwork = {
                units: [...network.units],
                bias: network.bias,
            };
            newNetwork.units[unit][component] = newValue;
            return newNetwork;
        })
    }
    function addUnit() {
        setNetwork(network => ({
            units: [...network.units, unit(0,0,0)],
            bias: network.bias,
        }))
    }
    function addUnits() {
        setNetwork(network => ({
            units: [
                ...network.units,
                unit(0,0,0),
                unit(0,0,0),
                unit(0,0,0),
                unit(0,0,0),
            ],
            bias: network.bias,
        }))
    }
    function delUnit() {
        setNetwork(network => ({
            units: network.units.slice(0, -1),
            bias: network.bias,
        }))
    }
    function delUnits() {
        setNetwork(network => ({
            units: network.units.slice(0, -4),
            bias: network.bias,
        }))
    }
    function updateBias(newValue) {
        setNetwork(network => ({
            units: [...network.units],
            bias: newValue,
        }))
    }
    return (<table>
        <thead>
            <tr>
                <th>Unit</th>
                <th>Incoming weight</th>
            { biased ? <th>Bias</th> : <></> }
                <th>Outgoing weight</th>
            </tr>
        </thead>
        <tbody>
            {network.units.map((u, i) => <tr>
                <td style={{textAlign: "center"}}>{i}</td>
                <td>
                    <WeightControl value={u.b} set={v => updateUnit(i,"b",v)}/>
                </td>
            { biased ?
                <td>
                    <WeightControl value={u.c} set={v => updateUnit(i,"c",v)}/>
                </td>
            : <></> }
                <td>
                    <WeightControl value={u.a} set={v => updateUnit(i,"a",v)}/>
                </td>
            </tr>)}
            <tr>
                <td>Units:</td>
                <td>
                    <button onClick={delUnits}>-4</button>
                    {" "}
                    <button onClick={delUnit}>-1</button>
                    {" "}
                    <button onClick={addUnit}>+1</button>
                    {" "}
                    <button onClick={addUnits}>+4</button>
                </td>
            { biased ?
                <>
                    <td style={{textAlign:"right"}}>Output unit bias:</td>
                    <td>
                        <WeightControl value={network.bias} set={updateBias} />
                    </td>
                </>
            : <td /> }
            </tr>
        </tbody>
    </table>);
}


export function WeightControl({ value, set }) {
    return (<>
        <input
            type="range" min={-20} max={+20}
            value={10*value} onChange={(e) => set(parseInt(e.target.value)/10)}
            style={{width: 100}}
        />
        <small>
        {(value).toFixed(1)}
        </small>
    </>);
}
    

export function NetworkFunction({ biased, network }) {
    return (<Mafs2>
        { biased ? <BiasPlot bias={network.bias} /> : <></> }
        { network.units.map(u => <UnitPlot unit={u} />) }
        <NetworkPlot network={network} />
    </Mafs2>);
}


export function NetworkUnits({ network }) {
    return (<Mafs1>
        { network.units.map(u => <UnitShadowPoint unit={u} /> )}
        { network.units.map(u => <UnitPoint unit={u} /> )}
    </Mafs1>);
}


// SMALLER CUSTOM APPS


export function AppUnbiased1() {
    const control = useMovablePoint([1, 1])
    const a = control.y;
    const b = control.x;
    return (<>
        <table>
        <thead><tr>
            <th>Parameter space</th>
            <th>Network</th>
            <th>Implemented function</th>
        </tr></thead>
        <tbody><tr>
        {/* parameter space */}
        <td><Mafs1>
            <Plot.OfX y={b => 0} />
            <Plot.OfY x={a => 0} />
            {control.element}
        </Mafs1></td>
        {/* network vis */}
        <td>
            <NetworkGraph network={{units: [unit(a, b, 0)], bias: 0}} />
        </td>
        {/* function plot */}
        <td><Mafs1>
            <Plot.OfX
                y={x => a * Math.tanh(b * x)}
                weight={2}
                color={"var(--main1)"}
            />
        </Mafs1></td>
        </tr></tbody>
        </table>
    </>);
}


export function AppUnbiased3() {
    const u1 = useMovablePoint([1.0,  1.0]);
    const u2 = useMovablePoint([0.5, -1.0]);
    const u3 = useMovablePoint([1.0,  0.6]);
    const network = {
        units: [u1, u2, u3].map(u => unit(u.y, u.x, 0)),
        bias: 0,
    };
    console.log(network);
    console.log(initialNetworkUnbiased);
    return (<>
        <table>
            <thead>
                <tr>
                    <th>Parameter space</th>
                    <th>Network</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    {/* parameter space */}
                    <td>
                        <Mafs1>
                            {u1.element}
                            {u2.element}
                            {u3.element}
                        </Mafs1>
                    </td>
                    {/* network vis */}
                    <td>
                        <NetworkGraph network={network} />
                    </td>
                </tr>
            </tbody>
        </table>
        {/* function plot */}
        <NetworkFunction biased={false} network={network} />
    </>);
}


// generic helper components and functions


// Within-plot components


function BiasPlot({ bias }) {
    return <Plot.OfX y={x => bias} style={"dashed"} />;
}


function UnitPlot({ unit }) {
    return (<Plot.OfX
        y={x => unit.a * Math.tanh(unit.b * x + unit.c)}
        weight={1}
    />);
}


function NetworkPlot({ network }) {
    const { units, bias } = network;
    return (<Plot.OfX
        y={x => bias + sum(units.map(u => u.a * Math.tanh(u.b * x + u.c)))}
        weight={2}
        color={"var(--main1)"}
    />);
}


function UnitPoint({ unit }) {
    return <Point x={unit.b} y={unit.c} />
}


function UnitShadowPoint({ unit }) {
    return (<Point
        x={-unit.b}
        y={-unit.c}
        color={"var(--text2)"}
    />);
}


// Standard-size wrapped mafs components


function Mafs1({ children }) {
    return <Mafs0 height={180} width={"180px"} maxx={1.25}> {children} </Mafs0>;
}


function Mafs2({ children }) {
    return <Mafs0 height={200} width={"auto"} maxx={3.25}> {children} </Mafs0>;
}


function Mafs4({ children }) {
    return <Mafs0 height={420} width={"auto"} maxx={3.25}> {children} </Mafs0>;
}


function Mafs0({ height, width, maxx, children }) {
    // TODO: unlock button enabled pan and zoom
    // TODO: add axis labels! with katex I guess?
    return (<RoundBox width={width}>
        <Mafs
            height={height}
            viewBox={{x: [-maxx,+maxx]}}
            pan={false}
            zoom={false}
        >
            <Coordinates.Cartesian subdivisions={2} />
            {children}
        </Mafs>
    </RoundBox>);
}


// neural network visualisation


export function networkLayout(network) {
    const h = Math.max(1, network.units.length);
    // horizontal stuff
    const HORIZONTAL_SPACING = 40;
    const HORIZONTAL_PADDING = 30;
    const CANVAS_WIDTH = (h-1) * HORIZONTAL_SPACING + 2 * HORIZONTAL_PADDING;
    // vertical stuff
    const VERTICAL_PADDING = 30;
    const CANVAS_HEIGHT = 180;
    return {
        canvasWidth:  CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        input:  {x: CANVAS_WIDTH / 2, y: VERTICAL_PADDING},
        output: {x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - VERTICAL_PADDING},
        units: Array.from({length: h}, (_, i) => ({
                x: HORIZONTAL_PADDING + i * HORIZONTAL_SPACING,
                y: CANVAS_HEIGHT / 2,
            })
        ),
    };
}

export function NetworkGraph({ network }) {
    const layout = networkLayout(network);
    return (<RoundBox width={"auto"}>
        <svg
            width={layout.canvasWidth}
            height={layout.canvasHeight}
            style={{display: "block", margin: "0 auto"}}
        >
            {/* graph paths */}
            { network.units.map((u, i) => <>
                <GraphPath p1={layout.input} p2={layout.units[i]} w={u.b}/>
                <GraphPath p2={layout.units[i]} p1={layout.output} w={u.a}/>
            </>)}
            {/* units */}
            <GraphNode pos={layout.input}/>
            <GraphNode pos={layout.output}/>
            { network.units.map((u, i) =>
                <GraphNode pos={layout.units[i]} />
            )}
        </svg>
    </RoundBox>);
}


function GraphNode({ pos }) {
    return (
        <g transform={translate(pos)}>
        <circle r={15}
            strokeWidth={1}
            stroke={"var(--text1)"}
            fill={"var(--back1)"}
        />
        </g>
    );
}


function GraphPath({ p1, p2, w }) {
    let d = (
        "M " + p1.x + " " + p1.y +
        "Q " + p2.x + " " + p1.y + " " + p2.x + " " + p2.y
    );
    let labelPos = {x: p2.x, y: (p1.y + p2.y) / 2}; // TODO: fit to curve
    let label;
    if (isNaN(Number(w))) {
        label = w;
    } else {
        label = w.toFixed(1);
    }
    return (<>
        <path
            d={d}
            stroke={peregrine(Number(w), -2, 2)}
            strokeWidth={3}
            fill={"transparent"}
        ></path>
        <g transform={translate(labelPos)}>
            {/* solid white background block */}
            <rect width={20}  height={16} transform={translate({x:-10,y:-9})}
                fill="var(--back1)" strokeWidth="0"
            />
            {/* the text itself */}
            <text style={{textAnchor: 'middle', dominantBaseline: 'middle'}}>
                {label}
            </text>
        </g>
    </>)
}


function RoundBox({ width, children }) {
    return (
        <div style={{
            border: "1px solid var(--text2)", /* matte.css colorscheme */
            background: "var(--back1)",
            borderRadius: "5px",
            overflow: "scroll",
            margin: "1ex 0",
            maxWidth: width,
            minWidth: width,
        }}>
            {children}
        </div>
    );
}


function vec(x, y) {
    return {x: x, y: y};
}


function unit(a, b, c) {
    return {a: a, b: b, c: c};
}


function sum(array) {
    return array.reduce((acc, a) => acc + a, 0);
}


function translate(position) {
    return "translate(" + position.x + "," + position.y + ")";
}

function colorMix(method, col1, col2, p) {
    return (
        "color-mix("
        + "in " + method + ", "
        + col1 + " " + ((1-p) * 100).toFixed(0) + "%, "
        + col2 + " " + ((p) * 100).toFixed(0) + "%)"
    );
}


function peregrine(x, min, max) {
    if (isNaN(x)) {
        x = (min + max) / 2;
    }
    if (x > max) {
        x = max;
    }
    if (x < min) {
        x = min;
    }
    let t = (x-min) / (max-min);
    if (t < 0.5) {
        return colorMix("srgb-linear","#2e7d32","var(--text2)",t/.5);
    } else {
        return colorMix("srgb-linear","var(--text2)","var(--main2)",(t-.5)/.5);
    }
}
