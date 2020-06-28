import React, { useRef, useEffect, useState } from 'react';

const NewsChart = ({news = [], localData = {}}) => {
    const chartRef = useRef();
    const [chart, setChart] = useState(null);
    useEffect(() => {
        if(chartRef){
            const chartInst = new Chart(chartRef.current, {
                type: 'line',
                    data: {
                    labels: [],
                    datasets: [{
                        label: 'Hackernews upvotes chart',
                        fill: false,
                        lineTension: 0.5,
                        backgroundColor: '#f77575',
                        borderColor: '#f77575',
                        data: [],
                    }],
                },
                options: {
                    responsive: true,
                    title: {
                        display: true,
                        text: 'Hackernews Chart'
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                }
            });
            chartInst.update();
            setChart(chartInst);
        }
    },[chartRef])
    
    useEffect(() => {
        console.log('nnn', news, localData, chart)
        const xAxis = news && news.map(item => item.objectID);
        const dataSeries = news && news.map(item => {
            if(localData && localData[item.objectID]){
                return localData[item.objectID].relevancy_score;
            }
            return item.relevancy_score || 0
        });
        if(chart && chart.data){    
            chart.data.labels = xAxis || [];
            chart.data.datasets && chart.data.datasets[0] && (chart.data.datasets[0].data = dataSeries || []);
            chart.update();
        }
    }, [news, localData])



    return (
        <canvas ref={chartRef} />
    )
}

export default NewsChart;