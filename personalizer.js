const personalizer = Personalizer({ name: 'fred' })
personalizer.createScope('paywall')

personalizer

  // since shouldInsert evaluates to false, should not insert
  .add({
    shouldInsert: (user) => {
      return user.name === 'tony'
    },
    insert: (user) => {
      console.log('should not insert')
    }
  })

  // since shouldInsert evaluates to true, should run insert logic
  .add({
    shouldInsert: (user) => {
      return user.name === 'fred'
    },
    insert: (user) => {
      console.log(`inserted ${user.name} yay`)
    }
  })
  // change scope
  .scope('paywall')

  // the first one to evaulate to true wins
  .add({
    shouldInsert: (user) => {
      return user.name === 'fred'
    },
    insert: (user) => {
      console.log(`inserted ${user.name} on the paywall scope`)
    }
  })
  .add({
    shouldInsert: (user) => {
      return user.name === 'fred'
    },
    insert: () => {
      console.log('no inserty')
    }
  })

  // run the scenarios
  .run()



function Personalizer(user = {}) {

  let scenarios = [],
    scopes = [];

  return {
    createScope,
    scope,
    add: function ({
      shouldInsert = () => { },
      insert = () => { },
      priority = null
    }) {
      scenarios = add(scenarios,
        [shouldInsert.bind(this, user), insert.bind(this, user)],
        priority);
      return this
    },
    get scenarios() {
      return scenarios
    },
    run
  }

  function run() {

    // run scenarios on the global scope
    scenarios.forEach((scenario) => {
      const [shouldShow = () => false,
        show = () => { }] = scenario
      shouldShow() && show()
    })

    // run scenarios for each scope
    scopes.forEach((scope) => {
      const scen = scope.scenarios.find((scenario = []) => {
        const [shouldShow = () => false] = scenario
        return shouldShow()
      })
      scen && scen[1]()
    })
  }

  function Scope(name = '') {

    let scenarios = [];

    return {
      add: function ({
        shouldInsert = () => { },
        insert = () => { },
        priority = null
      }) {
        // @todo: should we also bind `scenarios` to `shouldInsert`
        // function here to give scenarios more awareness of each other?
        scenarios = add(scenarios,
          [shouldInsert.bind(this, user),
          insert.bind(this, user)],
          priority);
        return this
      },
      get name() {
        return name;
      },
      get scenarios() {
        return scenarios
      },
      run
    }
  }

  function add(agg = [], scen = [() => false, () => { }], priority = null) {
    return (priority === null) ? pushScenario(agg, scen) : insertScenario(agg, scen, priority)
  }

  function scope(name) {
    return scopes.find((scope) => scope.name === name)
  }

  function pushScenario(agg = [], scen = () => false) {
    agg.push(scen)
    return agg
  }

  function insertScenario(agg = [], scen = () => false, priority = 0) {
    agg = agg.splice(priority, 0, scen)
    return agg
  }

  function createScope(name) {
    scopes.push(Scope(name))
  }
}
