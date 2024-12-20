
        <div
          justify="space-between"
          align="center"
          wrap="nowrap"
          style={{ gap: "20px", width: "100%"}}
        >
          {/* Left Side Countries */}
          <Flex direction="column" gap="sm" style={{ flex: "1" }}>
            {leftAreas.map((area) => (
              <Button
                key={area}
                onClick={() => handleGuess(area)}
                disabled={guessedAreas.has(area)}
                variant={guessedAreas.has(area) ? "outline" : "filled"}
                color={guessedAreas.has(area) ? "gray" : "teal"}
              >
                {area}
              </Button>
            ))}
          </Flex>

          {/* Center Content */}
          <Flex
            direction="column"
            align="center"
            justify="center"
            gap="sm"
            style={{ flex: "1", textAlign: "center" }}
          >
            <Box
              component="img"
              src={meal.image}
              alt="Meal"
              style={{ width: "100%", maxWidth: "300px", borderRadius: "8px" }}
            />
            <Text>
              Lives:{" "}
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} style={{ color: i < lives ? "red" : "gray" }}>
                  ♥
                </span>
              ))}
            </Text>
            <Text>Score: {score}</Text>
            {gameOver && (
              <Button onClick={restartGame} color="red">
                Restart Game
              </Button>
            )}
          </Flex>

          {/* Right Side Countries */}
          <Flex direction="column" gap="sm" style={{ flex: "1" }}>
            {rightAreas.map((area) => (
              <Button
                key={area}
                onClick={() => handleGuess(area)}
                disabled={guessedAreas.has(area)}
                variant={guessedAreas.has(area) ? "outline" : "filled"}
                color={guessedAreas.has(area) ? "gray" : "teal"}
              >
                {area}
              </Button>
            ))}
          </Flex>
        </Flex>