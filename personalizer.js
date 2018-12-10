const personalizer = Personalizer({ name: 'fred' })

personalizer
  .add((user) => {
    console.log(`inserted ${user.name} second; priority: 1`)
  }, 1)
  .add((user) => {
    console.log(`inserted ${user.name} first; priority: 10`)
  }, 10)


  // change scope
  .scope('paywall')

  // should run second
  .add((user, close) => {
    if (true) {
      console.log(`inserted ${user.name} on the paywall scope; priority: 15`)
    }
  }, 15)
  // should run first
  .add((user, close) => {
    console.log(`inserted ${user.name} on the paywall scope; pirority: 10`)
    close()
  }, 10)

  // since end was called, should not run at all
  .add((user) => {
    console.log('no runny! 💀💀💀💀💀💀💀💀')
  }, 1)

  // run the scenarios
  .run()


function Personalizer(user = {}) {

  let scenarios = [],
    scopes = [];

  return {
    createScope,
    scope,
    add: function (scenario = () => { }, priority = null) {
      scenarios = add(scenarios,
        scenario.bind(this, user),
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
    scenarios.reverse().forEach((scenario) => scenario())

    scopes.forEach((scope) => {
      scope.scenarios.reverse();

      scope.scenarios.forEach((scenario) => {
        scope.closed || scenario()
      })
    })
  }

  function Scope(name = '') {

    let scenarios = [],
      closed = false;

    function close() {
      closed = true;
    }

    return {
      add: function (scenario = () => { }, priority = null) {
        scenarios = add(scenarios,
          scenario.bind(this, user, close),
          priority);
        return this
      },
      get name() {
        return name;
      },
      get scenarios() {
        return scenarios
      },
      run,
      scope,
      get closed() {
        return closed
      }
    }
  }

  function add(agg = [], scen = () => { }, priority = null) {
    return (priority === null) ? pushScenario(agg, scen) :
      insertScenario(agg, scen, priority)
  }

  function scope(name) {
    return scopes.find((scope) => scope.name === name) || createScope(name)
  }

  function pushScenario(agg = [], scen = () => { }) {
    agg.push(scen)
    return agg
  }

  function insertScenario(agg = [], scen = () => { }, priority = 0) {
    // @todo if space occupied, use splice
    agg[priority] = scen
    return agg
  }

  function createScope(name) {
    const newScope = Scope(name)
    scopes.push(newScope)
    return newScope;
  }
}
