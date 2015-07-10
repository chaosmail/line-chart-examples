angular
  // Main Application
  .module("examples", ['xeditable', 'n3-line-chart'])

  .run(function(editableOptions) {
    editableOptions.theme = 'bs3';
  })

  // Github details
  .constant('GITHUB_DETAILS', {user: 'n3-charts', repo: 'line-chart'})

  // Main Controller
  .controller('MainCtrl', function($scope, repo){

    $scope.branch = 'master';
    $scope.branches = [];

    $scope.listBranches = function(){
      return $scope.branches.length ? null : repo.listBranches().then(function(branches){
        $scope.branches = branches;
      });
    }

    $scope.params = {
      lineMode: [
        'linear', 'step-before', 'step-after', 'basis',
        'basis-open', 'basis-closed', 'bundle', 'cardinal',
        'cardinal-open', 'cadinal-closed', 'monotone'
      ],
      tooltip: {
        mode: [
          'scrubber', 'axes', 'none'
        ]
      },
      series:{
        axis: [
          'y', 'y2'
        ],
        type: [
          'line', 'area', 'column'
        ],
        lineMode: [
          '', 'dashed'
        ]
      },
      axis: {
        type: [
          'linear', 'date', 'log'
        ]
      }
    }

    $scope.data = {
      dataset0: d3.range(10).map(function(d){
        return {
          x: d,
          y0: rand(0, 10),
          y1: rand(0, 100),
          y2: rand(0, 50)
        }
      })
    };
    
    $scope.options = {
      tooltip: {
        mode: 'scrubber'
      },
      axes: {
        y: {
          tooltipFormat: '.2f'
        }
      },
      series: [
        {
          y: "y0",
          label: "A line",
          color: "steelblue"
        },
        {
          y: "y1",
          label: "A column",
          color: "orange",
          type: "column"
        },
        {
          y: "y2",
          label: "An area",
          color: "salmon",
          type: "area"
        }
      ]
    };

    // Legacy Mode
    $scope.legacyData = $scope.data.dataset0;

    $scope.$watch('branch', function(newVal, oldVal){
      if (newVal != oldVal) {
        window.location.href = "?branch=" + newVal;
      }
    });

    $scope.addDatapoint = function(dataset){
      $scope.data[dataset].push({
        x: $scope.data[dataset][$scope.data[dataset].length - 1].x + 1,
        y0: rand(0, 10),
        y1: rand(0, 100),
        y2: rand(0, 50)
      });
    }

    $scope.removeDatapoint = function(dataset, point){
      $scope.data[dataset].splice(
        $scope.data[dataset].indexOf(point), 1
      );
    }

    function rand(min, max) {
      min = min || 0;
      max = max || 1;
      return min + (max - min) * Math.random();
    }
  })

  .factory('repo', function($q, github, GITHUB_DETAILS){
    
    return {
      'name': GITHUB_DETAILS.repo,
      'listBranches': listBranches
    }

    function listBranches() {
      return $q(function(resolve, reject) {
        return github.getRepo(GITHUB_DETAILS.user, GITHUB_DETAILS.repo)
          .listBranches(function(err, branches) {
            if (err){
              reject(err);
            } else {
              resolve(branches);
            }
          });
      });
    }
  })

  .factory('github', function(){
    return new Github({});
  });

// Bootstrap App
angular.element(document).ready(function() {
  var elem = document.getElementById('examples');
  angular.bootstrap(elem, ['examples'])
})

