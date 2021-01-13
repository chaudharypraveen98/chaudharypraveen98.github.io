$(function () {

    'use strict';
    var chartType="line";
    $('select').on('change', function() {
        chartType = this.value;
        setChart3();
    });

    // Start chart
    Chart.defaults.global.animation.duration = 2000; // Animation duration
    Chart.defaults.global.title.display = false; // Remove title
    Chart.defaults.global.title.text = "Chart"; // Title
    Chart.defaults.global.title.position = 'top'; // Title position
    Chart.defaults.global.defaultFontColor = '#999'; // Font color
    Chart.defaults.global.defaultFontSize = 10; // Font size for every label

    // Chart.defaults.global.tooltips.backgroundColor = '#FFF'; // Tooltips background color
    Chart.defaults.global.tooltips.borderColor = 'white'; // Tooltips border color
    Chart.defaults.global.legend.labels.padding = 0;
    Chart.defaults.scale.ticks.beginAtZero = true;
    Chart.defaults.scale.gridLines.zeroLineColor = 'rgba(255, 255, 255, 0.1)';
    Chart.defaults.scale.gridLines.color = 'rgba(255, 255, 255, 0.02)';
    Chart.defaults.global.legend.display = false;

    setChart3();
    function setChart3() {
        var chart = document.getElementById('chart3');
        var myChart = new Chart(chart, {
            type: chartType,
            data: {
                labels: ["January", "February", "March", "April", 'May', 'June', 'July', 'August','September','October','November','December'],
                datasets: [{
                    label: [1,2,3,4,5,6,7,8,9,10,11,12],
                    fill: false,
                    lineTension: .3,
                    pointBorderColor: "transparent",
                    pointColor: "white",
                    borderColor: '#d9534f',
                    borderWidth: 2,
                    showLine: true,
                    data: [9,7,4,6,3,4,7,1,2,3,5,7],
                    pointBackgroundColor: 'transparent',
                },
                //     {
                //     label: uniqueYears[1],
                //     fill: false,
                //     lineTension: .3,
                //     pointColor: "white",
                //     borderColor: '#5cb85c',
                //     borderWidth: 2,
                //     showLine: true,
                //     data: yearSales[1],
                //     pointBackgroundColor: 'transparent',
                // },
                    // {
                    //     label: "Lost",
                    //     fill: false,
                    //     lineTension: .3,
                    //     pointColor: "white",
                    //     borderColor: '#f0ad4e',
                    //     borderWidth: 2,
                    //     showLine: true,
                    //     data: [10, 40, 20, 5, 35, 15, 35, 0],
                    //     pointBackgroundColor: 'transparent',
                    // },
                    // {
                    //     label: uniqueYears[2],
                    //     fill: false,
                    //     lineTension: .3,
                    //     pointColor: "white",
                    //     borderColor: '#337ab7',
                    //     borderWidth: 2,
                    //     showLine: true,
                    //     data: yearSales[2],
                    //     pointBackgroundColor: 'transparent',
                    // }
                ]
            },
        });
    }
});