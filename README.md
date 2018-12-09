# Isomorphic Personalzation API proposal

## Concepts

### User
Data about the user. Contains a `history` object (data about the users history on the site(s)) and a `data` object. Exposes methods to safely update the `history` and `data` in a data store.

### Personalizer
Class responsible for maintaining a list of scenarios, evaluating and executing them

### Scenario
A set of two functions: `shouldInsert` and `insert`
`insert` makes no assumptions about the actual method of insertion but is called when the personalizer evaluates the `shouldInsert` as true. Both methods take the same signature:  
`function(user){}`  
where `user` is a User. This allows decision about the insertion, both the method and the decision on whether to insert, based on data defined the `user`

### Scope
You may add a scope to the personalizer to prevent two insertions that are mutually exclusive. For example if two scenarios evaluate to true, only insert the first that evaluates as true.

