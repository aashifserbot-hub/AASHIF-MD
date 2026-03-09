function hackPrank(user){
    let steps = [
        `Connecting to ${user}...`,
        'Bypassing firewall...',
        'Extracting passwords...',
        'Downloading private files...',
        'Hack complete! ✅'
    ];
    return steps.join('\n');
}

module.exports = { hackPrank };
