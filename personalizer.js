const personalizer = Personalizer(user = { name: 'fred' })
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
    insert: () => {
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
      add([shouldInsert.bind(this, user), insert.bind(this, user)], priority);
      return this
    },
    get scenarios() {
      return scenarios
    },
    run: function (func) {
      run(func)
      return this;
    }
  }

  function run() {
    scenarios.forEach((scenario) => {
      const [shouldShow = () => false,
        show = () => { }] = scenario
      shouldShow() && show()
    })
  }

  function Scope(name = '') {

    let scenarios = [];

    function add(scen = [() => false, () => { }], priority = null) {
      //console.log(scen)
      scenarios = (priority === null) ? pushScenario(scen) : insertScenario(scen, priority)
    }

    // run the first scenario that evaluates as true.
    function run() {
      scenarios.find((scenario = []) => {
        const [shouldShow = () => false] = scenario
        return shouldShow()
      })[1]()
    }

    return {
      add: function ({
        shouldInsert = () => { },
        insert = () => { },
        priority = null
      }) {
        // @todo: should we also bind `scenarios` to `shouldInsert`
        // function here to give scenarios more awareness of each other?
        add([shouldInsert.bind(this, user), insert.bind(this, user)], priority);
        return this
      },
      get name() {
        return name;
      },
      get scenarios() {
        return scenarios
      },
      run: function () {
        run()
        return this;
      }
    }
  }

  function add(scen = [() => false, () => { }], priority = null) {
    //console.log(scen)
    scenarios = (priority === null) ? pushScenario(scen) : insertScenario(scen, priority)
  }

  function scope(name) {
    return scopes.find((scope) => scope.name === name)
  }

  function pushScenario(scen = () => false) {
    scenarios.push(scen)
    return scenarios
  }

  function insertScenario(scen = () => false, priority = 0) {
    scenarios = scenarios.splice(priority, 0, scen)
    return scenarios
  }

  function createScope(name) {
    scopes.push(Scope(name))
  }
}
