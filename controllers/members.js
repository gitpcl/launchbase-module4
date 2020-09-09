const fs = require('fs')
const data = require('../data.json')
const { date } =  require('../utils')

exports.index = function(req,res) {
    return res.render("members/index", {members: data.members})
}

exports.create = function(req,res) {
    return res.render("members/create")
}

// post - create
exports.post = function(req,res) {
    //********** Form Validation
    // ["avatar_url","name","birth","gender","services"]
    const keys = Object.keys(req.body)

    for(key of keys) {
        // req.body.key == ""
        if (req.body[key] == "" ) {
            return res.send('Please fill out all required fields')
        }
    }


    birth = Date.parse(req.body.birth)

    let id = 1
    const lastMember = data.members[data.members.length - 1]

    if (lastMember) {
        id = lastMember.id + 1
    }

    // insert data into data.json array
    data.members.push({
        id,
        ...req.body,
        birth
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if (err) return res.send("Write file error!")
    
        return res.redirect("/members")
    })

    // req.query must use GET
    // req.body must use POST

    // return res.send(req.body)

    //********** Form Validation End
}

//show
exports.show = function(req,res) {
    //req.query.id
    //req.body
    
    const {id} = req.params
    const foundMember = data.members.find(function(member){
        return member.id == id
    })

    if(!foundMember) return res.send("Member not found!")

    const member = {
        ...foundMember,
        birth: date(foundMember.birth).birthDay
        // created_at: new Intl.DateTimeFormat('en-US').format(foundMember.created_at),
    }

    return res.render("members/show", { member })

}

// edit
exports.edit = function(req,res) {
    const {id} = req.params
    const foundMember = data.members.find(function(member){
        return id == member.id
    })

    if(!foundMember) return res.send("Member not found!")

    const member = {
        ...foundMember,
        birth: date(foundMember.birth).iso
    }

    return res.render('members/edit', { member })
}

// put
exports.put = function(req,res) {
    const {id} = req.body
    let index = 0

    const foundMember = data.members.find(function(member, foundIndex){
        if (id == member.id) {
            index = foundIndex
            return true 
        }
    })

    if(!foundMember) return res.send("Member not found!")

    const member = {
        ...foundMember,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.members[index] = member

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send("Write error!")

        return res.redirect(`/members/${id}`)
    })
}

// delete
exports.delete = function(req,res) {
    const { id } = req.body
    const filteredMembers = data.members.filter(function(member) {
        return member.id != id
    })

    data.members = filteredMembers

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write file error!")

        return res.redirect("/members")
    })
}